import { Configuration, OpenAIApi } from 'openai'
import fs from 'fs'
import path from 'path'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export default async function audios(req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          'OpenAI API key not configured, please follow instructions in README.md',
      },
    })
    return
  }

  const filename = 'audio.m4a'
  const filePath = path.join(process.cwd(), filename)
  const file = fs.createReadStream(filePath)

  try {
    const resp = await openai.createTranscription(
      file,
      'whisper-1'
    )
    res
      .status(200)
      .json({ text: resp.data.text })
    

  } catch (error) {
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
