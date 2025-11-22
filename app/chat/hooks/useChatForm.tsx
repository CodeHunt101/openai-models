import { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { mapChatArray } from '@/utils/utils'
import { Message } from '@/types/types'

export default function useChatForm(
  setMessages: Dispatch<SetStateAction<string | Message[]>>,
  setLoading: Dispatch<SetStateAction<boolean>>
) {
  const [input, setInput] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [selectedImageURLs, setSelectedImageURLs] = useState<string[]>([])
  const { user } = useUser()

  const handleImageChange = (e: FormEvent<HTMLInputElement>) => {
    const fileInput = e.target as HTMLInputElement
    const files = Array.from(fileInput.files || [])

    const allowedExtensions = ['.png', '.jpeg', '.jpg', '.webp', '.gif']
    const validFiles = files.filter((file) => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      return allowedExtensions.includes(`.${fileExtension}`)
    })

    if (validFiles.length !== files.length) {
      alert(
        'Some files have invalid types. Please select PNG, JPEG, WEBP, or non-animated GIF files only.'
      )
      fileInput.value = ''
    } else {
      setSelectedFiles(validFiles)
    }
  }

  const handleTextChange = (e: FormEvent<HTMLTextAreaElement>) => {
    setInput((e.target as HTMLFormElement).value)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData()
    if (selectedFiles) {
      selectedFiles.forEach((file, index) => {
        formData.append(`file${index}`, file)
      })
    }

    formData.append('prompt', input)
    formData.append('user', user?.email || '')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        )
      }

      if (selectedFiles) {
        setSelectedImageURLs(
          selectedFiles.map((file) => URL.createObjectURL(file))
        )
      }

      setMessages(
        mapChatArray(data.result) || 'No result returned from the API'
      )
      setInput('')
      // Reset the file input element here
      const fileInput = document.getElementById(
        'file-input'
      ) as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
      }
    } catch (error: any) {
      console.error(error)
      alert(error.message)
    }
    setLoading(false)
    setSelectedFiles([])
  }

  return {
    input,
    selectedImageURLs,
    handleImageChange,
    handleTextChange,
    handleSubmit,
  }
}
