import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export default async function chat(
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
    const chatCompletion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: generatePrompt(prompt) }],
      temperature: 0.6,
    })
    res
      .status(200)
      .json({ result: chatCompletion.data.choices[0].message?.content })
    
    console.log({ result: chatCompletion.data.choices[0].message?.content })
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

function generatePrompt(prompt: string) {
  console.log({ prompt })
  const capitalizedPrompt =
    prompt[0].toUpperCase() + prompt.slice(1).toLowerCase()
  return capitalizedPrompt
}
