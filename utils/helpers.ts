import formidable from 'formidable'
import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'

export function validatePromptFromJson(
  req: NextApiRequest,
  res: NextApiResponse
): string | null {
  const prompt = req.body.prompt || ''
  validatePrompt(prompt, res)
  return prompt
}

export function validatePromptFromForm(
  fields: formidable.Fields<string>,
  res: NextApiResponse
): string | null {
  const prompt = (fields.prompt?.[0] as string) || ''
  validatePrompt(prompt, res)
  return prompt
}

export function validatePrompt(
  prompt: string,
  res: NextApiResponse
): void | null {
  if (prompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please enter a valid prompt',
      },
    })
    return null
  }
}

export const isUploadedFileValid = (
  uploadedFile: formidable.File[],
  res: NextApiResponse
) => {
  if (
    !uploadedFile ||
    !uploadedFile[0] ||
    uploadedFile[0].size === 0 ||
    uploadedFile[0].size > 2e7
  ) {
    res.status(400).json({
      error: {
        message: 'Please upload a valid file',
      },
    })
    return false
  }
  return true
}

export const pollForFile = (
  filePath: string,
  interval: number,
  timeout: number
) => {
  const start = Date.now()

  return new Promise((resolve, reject) => {
    const checkFile = () => {
      fs.access(filePath, fs.constants.R_OK, (err) => {
        if (!err) {
          // File exists and is readable
          resolve(filePath)
          return filePath
        } else if (Date.now() - start >= timeout) {
          reject(
            new Error(
              `File not found within the specified timeout: ${filePath}`
            )
          )
        } else {
          // Continue polling
          setTimeout(checkFile, interval)
        }
      })
    }

    checkFile()
  })
}

export const encodeImage = (imagePath: string) => {
  try {
    const imageBuffer = fs.readFileSync(imagePath)
    const base64Image = imageBuffer.toString('base64')
    return base64Image
  } catch (error: any) {
    console.error(`Error encoding image: ${error.message}`)
    return null
  }
}
