import { MessageWithAuthUser } from '@/types/types'
import {
  addAssistantMessage,
  addUserMessage,
  filterMessagesByUser,
  logMessageWithTimestamp,
  validatePromptFromJson,
} from '@/utils/helpers'
import { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
const openai = new OpenAI()

let messagesWithUser: MessageWithAuthUser[] = []

export default async function chat(req: NextApiRequest, res: NextApiResponse) {
  const prompt = validatePromptFromJson(req, res)
  if (!prompt) return

  const user = req.body.user

  logMessageWithTimestamp('Chat', prompt)
  messagesWithUser = addUserMessage(prompt, user, messagesWithUser)

  const filteredMessages = filterMessagesByUser(user, messagesWithUser)

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: filteredMessages as ChatCompletionMessageParam[],
      temperature: 0.8,
    })

    const response = chatCompletion.choices[0].message?.content
    messagesWithUser = addAssistantMessage(user, response, messagesWithUser)
    filteredMessages.push({ role: 'assistant', content: response ?? '' })

    console.log({ messagesWithUser })
    console.log({ filteredMessages })

    res.status(200).json({ result: filteredMessages })
  } catch (error: any) {
    console.error(error)
    if (error.response) {
      console.error(error.response.status, error.response.data)
      res.status(error.response.status).json(error.response.data)
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`)
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      })
    }
  }
}
