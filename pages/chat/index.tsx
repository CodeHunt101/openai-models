import { useState } from 'react'
import TextResult from '@/components/TextResult'
import Image from 'next/image'
import { Message } from '../../types/types'
import { useUser } from '@auth0/nextjs-auth0/client'
import ChatForm from './ChatForm'
import { Loading } from '@/components/Loading'
import useChatMessages from './hooks/useChatMessages'
import useChatForm from './hooks/useChatForm'

export default function Chat() {
  const { user } = useUser()
  const [messages, setMessages] = useState<Message[] | string>([])
  const [loading, setLoading] = useState(false)

  useChatMessages(setMessages, setLoading)

  const {
    input,
    selectedImageURLs,
    handleImageChange,
    handleTextChange,
    handleSubmit,
  } = useChatForm(setMessages, setLoading)

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
          {selectedImageURLs.length > 0 &&
            selectedImageURLs.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={`Selected Image ${index + 1}`}
                width={256}
                height={256}
                className="selected-image my-4"
              />
            ))}
          <TextResult messages={messages} />
        </>
      )}
      {loading && <Loading />}
      <ChatForm
        input={input}
        handleSubmit={handleSubmit}
        onTextChange={handleTextChange}
        onImageChange={handleImageChange}
        loading={loading}
      />
    </div>
  )
}
