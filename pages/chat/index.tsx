import { FormEvent, useEffect, useState } from 'react'
import TextResult from '@/components/TextResult'
import Image from 'next/image'
import { mapChatArray } from '@/utils/utils'
import { Message } from '../../types/types'
import { useUser } from '@auth0/nextjs-auth0/client'
import { TextArea } from '@/components/TextArea'
import { FileInput } from '@/components/FileInput'
import { SubmitButton } from '@/components/SubmitButton'
import { FileType } from '@/types/enums'

export default function Chat() {
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [input, setInput] = useState('')
  const [selectedImageURL, setSelectedImageURL] = useState('')
  const [messages, setMessages] = useState<Message[] | string>([])
  const { user } = useUser()

  useEffect(() => {
    const formData = new FormData()
    formData.append('user', user?.email || '')
    formData.append('getMessages', true.toString())
    const getMessages = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/chat', {
          method: 'POST',
          body: formData,
        })

        const { result } = await response.json()
        setMessages(mapChatArray(result))
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setLoading(false)
      }
    }
    getMessages()
  }, [user?.email])

  const onImageChange = (e: FormEvent<HTMLInputElement>) => {
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

  const onTextChange = (e: FormEvent<HTMLTextAreaElement>) => {
    setInput((e.target as HTMLFormElement).value)
  }

  async function onSubmit(event: any) {
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

  const handleNewThread = async () => {
    const formData = new FormData()
    formData.append('deleteMessages', true.toString())
    formData.append('user', user?.email || '')
    try {
      setLoading(true)
      await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      })
      setMessages([])
    } catch (error) {
      console.error(error)
      setMessages('Some error occurred, please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center mt-5">
      <div className="badge badge-primary text-lg p-5">Chat</div>
      <p>Images will not be saved</p>
      {messages.length > 0 && (
        <button onClick={handleNewThread} className="btn btn-accent my-2">
          Start New Thread
        </button>
      )}
      {messages.length > 0 && (
        <>
          {selectedImageURL && (
            <Image
              src={selectedImageURL}
              alt="Selected Image"
              width={512}
              height={512}
              className="selected-image my-4"
            />
          )}
          <TextResult messages={messages} />
        </>
      )}
      {loading && <span className="loading loading-dots loading-lg"></span>}
      <form
        method="post"
        onSubmit={onSubmit}
        className="form-control w-full max-w-lg"
        encType="multipart/form-data"
      >
        <label className="label">
          <span className="label-text">Enter your prompt</span>
        </label>
        <TextArea input={input} onChange={onTextChange} />
        <FileInput fileType={FileType.IMAGE} onChange={onImageChange} />
        <label className="label"></label>
        <SubmitButton
          title="Generate response"
          disabled={loading || input.length < 2}
        />
      </form>
    </div>
  )
}
