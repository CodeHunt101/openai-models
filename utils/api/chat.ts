import OpenAI from 'openai'
import fs, { PathLike } from 'fs'
import path from 'path'
import { Files } from 'formidable'
import {
  pollForFile,
  encodeImage,
  areUploadedFilesValid,
  addAssistantMessage,
} from '../helpers'
import { NextApiResponse } from 'next'
import { ChatCompletionModel } from '@/types/enums'
import { ChatCompletionMessageParam } from 'openai/resources'
import { messagesWithUser, updateMessagesWithUser } from '@/pages/api/chat'
import {
  getChatCompletion,
  getChatCompletionWithVisuals,
} from '../openai-requests'

// Constants
const POLL_INTERVAL = 1000 // 1 second
const POLL_TIMEOUT = 60000
const openai = new OpenAI()

export const handlePromptOnly = async (
  filteredMessages: ChatCompletionMessageParam[],
  user: string,
  res: NextApiResponse
) => {
  try {
    const chatCompletion = await getChatCompletion(
      filteredMessages,
      ChatCompletionModel.GPT_5,
      openai
    )
    const response = chatCompletion.choices[0].message?.content
    updateMessages(user, response, filteredMessages)

    return res.status(200).json({ result: filteredMessages.slice(-10) })
  } catch (error: any) {
    handleError(error, res)
  }
}

export const handlePromptWithImage = async (
  filteredMessages: ChatCompletionMessageParam[],
  user: string,
  uploadedFiles: Files<string>,
  prompt: string,
  res: NextApiResponse
) => {
  const jsonUploadedFiles = JSON.parse(JSON.stringify(uploadedFiles))
  console.log(jsonUploadedFiles)

  const uploadedFileValidity = areUploadedFilesValid(jsonUploadedFiles, res)
  if (!uploadedFileValidity) return

  const base64Images = []
  const imagePaths = []
  const fileTypes = []
  const tempDirectory = '/tmp'

  for (const [_, fileArr] of Object.entries(jsonUploadedFiles)) {
    const uploadedFile = (fileArr as any)[0]
    const originalImagePath = uploadedFile.filepath

    // Get the file extension from the content type
    const contentType = uploadedFile.originalFilename
    const contentTypeParts = contentType?.split('.')
    const currFileType = contentTypeParts?.pop()
    fileTypes.push(currFileType)

    // Ensure a valid file type is obtained
    if (!fileTypes[fileTypes.length - 1]) {
      throw new Error('Unable to determine file type')
    }
    const tempFilePath = path.join(
      tempDirectory,
      `tempImage-${uploadedFile.newFilename}.${currFileType}`
    )
    await fs.promises.rename(originalImagePath, tempFilePath)
    imagePaths.push(tempFilePath)

    // Poll for the final image
    await pollForFile(tempFilePath, POLL_INTERVAL, POLL_TIMEOUT)

    const base64Image = encodeImage(tempFilePath)
    if (!base64Image) {
      throw Error('problem with encoding image')
    }
    base64Images.push(base64Image)
  }

  try {
    const chatCompletion = await getChatCompletionWithVisuals(
      prompt,
      ChatCompletionModel.GPT_5,
      base64Images,
      openai
    )
    const response = chatCompletion.choices[0].message?.content
    updateMessages(user, response, filteredMessages)

    res.status(200).json({ result: filteredMessages.slice(-10) })
  } catch (error: any) {
    handleError(error, res)
  } finally {
    // Remove the temporary image file
    imagePaths.forEach(async (imagePath) => {
      try {
        await fs.promises.unlink(imagePath as PathLike)
      } catch (unlinkError: any) {
        console.error(`Error deleting image: ${unlinkError.message}`)
      }
    })
  }
}

const updateMessages = (
  user: string,
  response: string | null,
  filteredMessages: ChatCompletionMessageParam[]
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
