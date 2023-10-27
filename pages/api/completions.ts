import { generatePrompt } from '@/utils/helpers'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export default async function completions(
  req: { body: { prompt: string } },
  res: {
    status: (status: number) => {
      json: { (arg0: { error?: { message: string }; result?: string }): void }
    }
  }
) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          'OpenAI API key not configured, please follow instructions in README.md',
      },
    })
    return
  }

  const prompt = req.body.prompt || ''
  if (prompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please enter a valid prompt',
      },
    })
    return
  }

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: generatePrompt(prompt),
      temperature: 0.6,
    })
    res.status(200).json({ result: completion.data.choices[0].text })
    console.log({ result: completion.data.choices[0].text })
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
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
