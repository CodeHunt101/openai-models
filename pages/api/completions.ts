import { validatePromptFromJson } from '@/utils/helpers';
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI();

export default async function completions(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const prompt = validatePromptFromJson(req, res);
  if (!prompt) return;

  console.log({ service: 'Completions', date: new Date().toLocaleString('en-AU'), prompt });

  try {
    const completion = await openai.completions.create({
      model: 'text-davinci-003',
      prompt,
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.choices[0].text });
    console.log({ result: completion.choices[0].text });
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
