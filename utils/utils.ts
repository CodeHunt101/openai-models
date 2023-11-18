import { Message } from '@/pages/types/types'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

export const mapChatArray = (
  array: ChatCompletionMessageParam[]
): Message[] => {
  const result: Message[] = []
  let currentUserMessage: Message | undefined

  array.forEach((item) => {
    if (item.role === 'user') {
      currentUserMessage = { user: item.content as string }
      result.push(currentUserMessage)
    } else if (item.role === 'assistant' && currentUserMessage) {
      currentUserMessage.assistant = item.content as string
    }
  })

  return result
}
