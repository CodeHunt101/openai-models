import { generatePrompt } from '@/utils/helpers';
import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, ImagesResponseDataInner, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function images(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
  console.log({ service: 'Image generation', date: new Date().toLocaleString(), prompt });

  try {
    const image = await openai.createImage({
      prompt: generatePrompt(prompt),
      n: 1,
      size: '1024x1024',
    });
    res.status(200).json({ result: image.data.data });
    console.log({ result: image.data.data[0].url });
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
