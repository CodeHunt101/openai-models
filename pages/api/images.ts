import { validatePromptFromJson } from '@/utils/helpers';
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from "openai";

const openai = new OpenAI();

export default async function images(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const prompt = validatePromptFromJson(req, res);
  if (!prompt) return;
  
  // console.log({ service: 'Image generation', date: new Date().toLocaleString('en-AU'), prompt });

  try {
    const image = await openai.images.generate({
      model: 'dall-e-2',
      prompt,
      n: 1,
      size: '256x256',
      // quality: 'standard'
    });
    console.log({ result: image.data[0].url });
    console.log(image.data)
    res.status(200).json({ result: image.data });
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.log(error)
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.log(error)
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
}
