import OpenAI from 'openai'
import fs, { PathLike } from 'fs'
import path from 'path'
import formidable from 'formidable'
import {
  pollForFile,
  encodeImage,
  isUploadedFileValid,
  addAssistantMessage,
} from '../helpers'
import { NextApiResponse } from 'next'
import { MessageWithoutUser } from '@/types/types'
import { ChatCompletionMessageParam } from 'openai/resources'
import { messagesWithUser, updateMessagesWithUser } from '@/pages/api/chat'

// Constants
const POLL_INTERVAL = 1000 // 1 second
const POLL_TIMEOUT = 60000

const openai = new OpenAI()

export const handlePromptOnly = async (
  filteredMessages: MessageWithoutUser[],
  user: string,
  res: NextApiResponse
) => {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: filteredMessages as ChatCompletionMessageParam[],
      temperature: 0.8,
    })
    const response = chatCompletion.choices[0].message?.content
    updateMessages(user, response, filteredMessages)

    return res.status(200).json({ result: filteredMessages.slice(-10) })
  } catch (error: any) {
    handleError(error, res)
  }
}

export const handlePromptWithImage = async (
  filteredMessages: MessageWithoutUser[],
  user: string,
  uploadedFile: formidable.File[],
  prompt: string,
  res: NextApiResponse
) => {
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
    updateMessages(user, response, filteredMessages)

    res.status(200).json({ result: filteredMessages.slice(-10) })
  } catch (error: any) {
    handleError(error, res)
  } finally {
    // Remove the temporary image file
    try {
      await fs.promises.unlink(imagePath as PathLike)
    } catch (unlinkError: any) {
      console.error(`Error deleting image: ${unlinkError.message}`)
    }
  }
}

const updateMessages = (
  user: string,
  response: string | null,
  filteredMessages: MessageWithoutUser[]
) => {
  const messagesWithUserWithAssistant = addAssistantMessage(
    user,
    response,
    messagesWithUser
  )
  updateMessagesWithUser(messagesWithUserWithAssistant)
  filteredMessages.push({ role: 'assistant', content: response ?? '' })

  console.log({ messagesWithUser })
  console.log({ filteredMessages })
}

export const handleError = (error: any, res: NextApiResponse) => {
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
}
