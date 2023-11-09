import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function chat(req: NextApiRequest, res: NextApiResponse) {
  if (!configuration.apiKey) {
    return res.status(500).json({
      error: {
        message:
          'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
  }

  const prompt = req.body.prompt || '';
  if (prompt.trim().length === 0) {
    return res.status(400).json({
      error: {
        message: 'Please enter a valid prompt',
      },
    });
  }

  try {
    console.log({ prompt });
    const chatCompletion = await openai.createChatCompletion({
      model: 'gpt-4-1106-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });
    const result = chatCompletion.data.choices[0].message?.content;
    console.log({ result });
    res.status(200).json({ result });
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
}
