import { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { mapChatArray } from '@/utils/utils'
import { Message } from '@/types/types'

export default function useChatForm(
  setMessages: Dispatch<SetStateAction<string | Message[]>>,
  setLoading: Dispatch<SetStateAction<boolean>>
) {
  const [input, setInput] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedImageURL, setSelectedImageURL] = useState('')
  const { user } = useUser()

  const handleImageChange = (e: FormEvent<HTMLInputElement>) => {
    const fileInput = e.target as HTMLInputElement
    const file = fileInput.files?.[0]
    if (file) {
      const allowedExtensions = ['.png', '.jpeg', '.jpg', '.webp', '.gif']
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      if (allowedExtensions.includes(`.${fileExtension}`)) {
        setSelectedFile(file)
      } else {
        alert(
          'Invalid file type. Please select a PNG, JPEG, WEBP, or non-animated GIF file.'
        )
        fileInput.value = ''
      }
    }
  }

  const handleTextChange = (e: FormEvent<HTMLTextAreaElement>) => {
    setInput((e.target as HTMLFormElement).value)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData()
    if (selectedFile) {
      formData.append('file', selectedFile)
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
      if (selectedFile) {
        setSelectedImageURL(URL.createObjectURL(selectedFile))
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
      // Consider implementing your own error handling logic here
      console.error(error)
      alert(error.message)
    }
    setLoading(false)
    setSelectedFile(null)
  }

  return {
    input,
    selectedImageURL,
    handleImageChange,
    handleTextChange,
    handleSubmit,
  }
}
