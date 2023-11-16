import { validatePromptFromJson } from '@/utils/helpers';
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const openai = new OpenAI();

const messages: ChatCompletionMessageParam[] = []

export default async function chat(req: NextApiRequest, res: NextApiResponse) {

  const prompt = validatePromptFromJson(req, res);
  if (!prompt) return;
  
  console.log({ service: 'Chat', date: new Date().toLocaleString('en-AU'), prompt });

  messages.push({role: 'user', content: prompt})

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages,
      temperature: 0.8,
    });
    const result = chatCompletion.choices[0].message?.content;
    messages.push({role: 'assistant', content: result ?? ''})
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
