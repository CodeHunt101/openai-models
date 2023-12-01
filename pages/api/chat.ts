import formidable from 'formidable'
import {
  validatePromptFromForm,
  logMessageWithTimestamp,
  addUserMessage,
  filterMessagesByUser,
} from '../../utils/helpers'
import { NextApiRequest, NextApiResponse } from 'next'
import { MessageWithAuthUser } from '@/types/types'
import { handlePromptOnly, handlePromptWithImage } from '@/utils/api/chat'

export const config = {
  api: {
    bodyParser: false,
  },
}

export let messagesWithUser: MessageWithAuthUser[] = []

export const updateMessagesWithUser = (newMessages: MessageWithAuthUser[]) => {
  messagesWithUser = newMessages
}

export default async function visualAnalysis(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = formidable({})
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err)
      return
    }

    const user = (fields.user?.[0] as string) || ''

    if (fields.getMessages?.[0]) {
      const filteredMessages = filterMessagesByUser(user, messagesWithUser)
      res.status(200).json({ result: filteredMessages.slice(-10) })
      return
    }

    if (fields.deleteMessages?.[0]) {
      messagesWithUser = messagesWithUser.filter(
        (message) => message.user !== user
      )
      return res.status(200).json({ message: 'removed messages' })
    }

    const prompt = validatePromptFromForm(fields, res)
    if (!prompt) return

    logMessageWithTimestamp('Chat', prompt)

    messagesWithUser = addUserMessage(prompt, user, messagesWithUser)
    const filteredMessages = filterMessagesByUser(user, messagesWithUser)
    const uploadedFile = files.file

    if (uploadedFile) {
      handlePromptWithImage(filteredMessages, user, uploadedFile, prompt, res)
    } else {
      handlePromptOnly(filteredMessages, user, res)
    }
  })
}
