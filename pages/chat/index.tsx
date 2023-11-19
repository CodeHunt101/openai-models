import { FormEvent, useState, useCallback } from 'react'
import Form from '@/components/form'
import TextResult from '@/components/textResult'
import { submitRequest } from '@/utils/api'
import { mapChatArray } from '@/utils/utils'
import { Message } from '../../types/types'
import { useRouter } from 'next/router'

export default function Chat() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[] | string>([])
  const router = useRouter()
  const { user } = router.query

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
        const apiResult = await submitRequest(
          '/api/chat',
          input,
          user as string
        )
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

  return (
    <div className="flex flex-col items-center mt-5">
      <h2>CHAT</h2>
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
