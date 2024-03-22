import OpenAI from 'openai'
import fs, { PathLike } from 'fs'
import path from 'path'
import formidable from 'formidable'
import { isUploadedFileValid, pollForFile } from '../../utils/helpers'
import { NextApiRequest, NextApiResponse } from 'next'
import { AudioTranscriptionModel } from '@/types/enums'
import { getAudioTranscription } from '@/utils/openai-requests'

// Constants
const POLL_INTERVAL = 1000 // 1 second
const POLL_TIMEOUT = 60000

export const config = {
  api: {
    bodyParser: false,
  },
}

const openai = new OpenAI()

export default function audios(req: NextApiRequest, res: NextApiResponse) {
  console.log({
    service: 'Audio transcription',
    date: new Date().toLocaleString('en-AU'),
  })

  const form = formidable({})

  form.parse(req, async (err, _fields, files) => {
    if (err) {
      console.log(err)
      return
    }
    const uploadedFile = files.file
    if (!uploadedFile) return

    const uploadedFileValidity = isUploadedFileValid(uploadedFile, res)
    if (!uploadedFileValidity) return

    const originalAudioPath = uploadedFile[0].filepath

    let audioPath, fileType
    const currentTime = Date.now()
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

      const tempFilePath = path.join(
        tempDirectory,
        `tempAudio-${currentTime}.${fileType}`
      )
      await fs.promises.rename(originalAudioPath, tempFilePath)
      audioPath = tempFilePath

      // Poll for the final audio
      await pollForFile(audioPath, POLL_INTERVAL, POLL_TIMEOUT)

      const audioFile = fs.createReadStream(audioPath)

      const audioTranscription = await getAudioTranscription(
        audioFile,
        AudioTranscriptionModel.WHISPER_1,
        openai
      )

      const result = audioTranscription.text
      console.log({ result })

      res.status(200).json({ result })
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
      // Remove the temporary audio file
      try {
        await fs.promises.unlink(audioPath as PathLike)
      } catch (unlinkError: any) {
        console.error(`Error deleting audio: ${unlinkError.message}`)
      }
    }
  })
}
