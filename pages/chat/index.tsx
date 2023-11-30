import { FormEvent, useState, useCallback, useEffect, useMemo } from 'react'
import Form from '@/components/form'
import TextResult from '@/components/textResult'
import { deleteMessages, submitRequest } from '@/utils/client'
import { mapChatArray } from '@/utils/utils'
import { Message } from '../../types/types'
import { useUser } from '@auth0/nextjs-auth0/client'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

export default function Chat() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[] | string>([])
  const { user } = useUser()

  useEffect(() => {
    const getApiResult = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ getMessages: true, user: user?.email }),
        })

        const { result } = await response.json()
        setMessages(
          mapChatArray(result as unknown as ChatCompletionMessageParam[])
        )
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setLoading(false)
      }
    }
    getApiResult()
  }, [user?.email])

  const handleChange = useCallback(
    (
      e:
        | React.FormEvent<HTMLTextAreaElement>
        | React.FormEvent<HTMLInputElement>
    ) => {
      setInput((e.target as HTMLFormElement).value)
    },
    []
  )

  const onSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault()
      setLoading(true)
      try {
        const apiResult = await submitRequest('/api/chat', user?.email, input)
        setMessages(
          mapChatArray(apiResult) || 'No result returned from the API'
        )
      } catch (error) {
        console.error(error)
        setMessages('Some error occurred, please try again.')
      } finally {
        setLoading(false)
        setInput('')
      }
    },
    [input, user]
  )

  const handleNewThread = async () => {
    try {
      setLoading(true)
      await deleteMessages('chat', user?.email)
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
      {messages.length > 0 && (
        <button onClick={handleNewThread} className="btn btn-accent my-2">
          Start New Thread
        </button>
      )}
      {loading && <span className="loading loading-dots loading-lg"></span>}
      {messages.length > 0 && <TextResult messages={messages} />}
      <Form
        input={input}
        handleChange={handleChange}
        handleSubmit={onSubmit}
        loading={loading}
      />
    </div>
  )
}
