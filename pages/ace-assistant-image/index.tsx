import { FormEvent, useEffect, useState } from 'react'
import TextResult from '@/components/textResult'
import { Message } from '../../types/types'
import { useUser } from '@auth0/nextjs-auth0/client'
import { submitRequest } from '@/utils/client'

export default function AceAssistantImage() {
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [messages, setMessages] = useState<Message[] | string>([])
  const { user } = useUser()

  useEffect(() => {
    const getApiResult = async () => {
      try {
        setLoading(true)
        const assistantResponse = await fetch('/api/ace-assistant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ retrieveLastMessage: true }),
        })

        const { lastMessage } = await assistantResponse.json()
        setMessages(lastMessage)
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setLoading(false)
      }
    }
    getApiResult()
  }, [])

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

  async function onSubmit(event: any) {
    event.preventDefault()
    setLoading(true)
    if (!selectedFile) {
      alert('Please add the file')
      setLoading(false)
      return
    }
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append(
      'prompt',
      'Transcribe the entire multiple choice question. Ignore non-english characters.'
    )
    formData.append('user', user?.email || '')
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      })

      const transcribedText = await response.json()
      if (response.status !== 200) {
        throw (
          transcribedText.error ||
          new Error(`Request failed with status ${transcribedText.status}`)
        )
      }

      const assistantResponse = await submitRequest(
        '/api/ace-assistant',
        user?.email,
        transcribedText.result[transcribedText.result.length - 1].content
      )
      setMessages(
        // mapChatArray(assistantResponse) || 'No result returned from the API'
        assistantResponse
      )

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
  }

  const handleNewThread = async () => {
    try {
      setLoading(true)
      await fetch('/api/ace-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deleteThread: true }),
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
      <div className="badge badge-primary text-lg p-5">ACE Assistant Image</div>
      <p>Images will not be saved</p>
      <p>Upload an Google ACE exam question and it will give you the answer</p>
      {messages?.length > 0 && (
        <button onClick={handleNewThread} className="btn btn-accent my-2">
          Start New Thread
        </button>
      )}
      {loading && <span className="loading loading-dots loading-lg"></span>}
      {messages?.length > 0 && <TextResult messages={messages} />}
      <form
        method="post"
        onSubmit={onSubmit}
        className="form-control w-full max-w-lg"
        encType="multipart/form-data"
      >
        <label className="label">
          <span className="label-text">Enter your prompt</span>
        </label>
        <input
          type="file"
          id="file-input"
          name="image"
          className="file-input file-input-bordered w-full max-w-xs"
          accept=".png, .jpeg, .jpg, .webp, .gif"
          onChange={onImageChange}
        />
        <label className="label"></label>
        <div className="flex justify-center">
          <button className="btn btn-primary" disabled={loading}>
            Generate response
          </button>
        </div>
      </form>
    </div>
  )
}
