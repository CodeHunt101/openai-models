import { MessageWithAuthUser } from '@/types/types'

export let messagesWithUser: MessageWithAuthUser[] = []

export const updateMessagesWithUser = (newMessages: MessageWithAuthUser[]) => {
  messagesWithUser = newMessages
}
