import OpenAI from 'openai'
import fs, { PathLike } from 'fs'
import path from 'path'
import formidable from 'formidable'
import {
  pollForFile,
  encodeImage,
  validatePromptFromForm,
  isUploadedFileValid,
  logMessageWithTimestamp,
  addUserMessage,
  filterMessagesByUser,
  addAssistantMessage,
} from '../../utils/helpers'
import { NextApiRequest, NextApiResponse } from 'next'
import { MessageWithAuthUser } from '@/types/types'

// Constants
const POLL_INTERVAL = 1000 // 1 second
const POLL_TIMEOUT = 60000

export const config = {
  api: {
    bodyParser: false,
  },
}

const openai = new OpenAI()

let messagesWithUser: MessageWithAuthUser[] = []

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
      res.status(200).json({ message: 'removed messages' })
      return
    }

    const prompt = validatePromptFromForm(fields, res)
    if (!prompt) return

    logMessageWithTimestamp('Visual Analysis', prompt)

    messagesWithUser = addUserMessage(prompt, user, messagesWithUser)

    const filteredMessages = filterMessagesByUser(user, messagesWithUser)

    const uploadedFile = files.file
    if (!uploadedFile) return

    const uploadedFileValidity = isUploadedFileValid(uploadedFile, res)
    if (!uploadedFileValidity) return

    const originalImagePath = uploadedFile[0].filepath

    let imagePath, fileType
    const tempDirectory = '/tmp'

    try {
      // Get the file extension from the content type
      const contentType = uploadedFile[0].originalFilename
      const contentTypeParts = contentType?.split('.')
      fileType = contentTypeParts?.pop()

      // Ensure a valid file type is obtained
      if (!fileType) {
        throw new Error('Unable to determine file type')
      }
      const tempFilePath = path.join(tempDirectory, `tempImage.${fileType}`)
      await fs.promises.rename(originalImagePath, tempFilePath)
      imagePath = tempFilePath

      // Poll for the final image
      await pollForFile(imagePath, POLL_INTERVAL, POLL_TIMEOUT)

      const base64Image = encodeImage(imagePath)

      const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: { url: `data:image/jpeg;base64,${base64Image}` },
              },
            ],
          },
        ],
        max_tokens: 600,
      })
      const response = chatCompletion.choices[0].message?.content
      messagesWithUser = addAssistantMessage(user, response, messagesWithUser)
      filteredMessages.push({ role: 'assistant', content: response ?? '' })
      console.log({ messagesWithUser })
      console.log({ filteredMessages })

      res.status(200).json({ result: filteredMessages.slice(-10) })
    } catch (error: any) {
      if (error.response) {
        console.error(error.response.status, error.response.data)
        res.status(error.response.status).json(error.response.data)
      } else {
        console.error(error.message)
        res.status(500).json({
          error: {
            message: error.message,
          },
        })
      }
    } finally {
      // Remove the temporary image file
      try {
        await fs.promises.unlink(imagePath as PathLike)
      } catch (unlinkError: any) {
        console.error(`Error deleting image: ${unlinkError.message}`)
      }
    }
  })
}
