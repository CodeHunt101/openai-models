'use client';

import { FormEvent, useState, useCallback } from 'react'
import Form from '@/components/Form'
import TextResult from '@/components/TextResult'
import { submitRequest } from '@/utils/client'
import { Message } from '@/types/types'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Loading } from '@/components/Loading'

export default function AceAssistant() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[] | string>([])
  const { user } = useUser()

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
          '/api/ace-assistant',
          user?.email,
          input
        )
        setMessages(
          // mapChatArray(apiResult) || 'No result returned from the API'
          apiResult
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
      <div className="badge badge-primary text-lg p-5">Ace Assistant</div>
      {loading && <Loading />}
      {messages.length > 0 && <TextResult messages={messages} />}
      <Form
        input={input}
        onChange={handleChange}
        onSubmit={onSubmit}
        loading={loading}
      />
    </div>
  )
}
