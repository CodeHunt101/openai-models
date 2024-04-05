import { Message } from '@/types/types'
import { mapChatArray } from '@/utils/utils'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export function useChatMessages(
  setMessages: Dispatch<SetStateAction<string | Message[]>>,
  setLoading: Dispatch<SetStateAction<boolean>>
) {
  const { user } = useUser()

  useEffect(() => {
    const formData = new FormData()
    formData.append('user', user?.email || '')
    formData.append('getMessages', true.toString())
    const fetchMessages = async () => {
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
    fetchMessages()
  }, [setLoading, setMessages, user?.email])
}
