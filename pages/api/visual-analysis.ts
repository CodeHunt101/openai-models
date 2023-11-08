import { Configuration, OpenAIApi } from 'openai';
import fs from 'fs';
import path from 'path';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function visualAnalysis(
  req: { body: { prompt: string } },
  res: {
    status: (status: number) => {
      json: { (arg0: { error?: { message: string }; result?: string }): void };
    };
  }
) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
    return;
  }

  function encodeImage(imagePath: string) {
    try {
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      return base64Image;
    } catch (error: any) {
      console.error(`Error encoding image: ${error.message}`);
      return null;
    }
  }

  // Usage
  const imageName = 'dad.jpeg';
  const imagePath = path.join(process.cwd(), imageName);
  const base64Image = encodeImage(imagePath);

  if (base64Image) {
    console.log('Encoded image:', base64Image);
  }

  // const filename = 'me.jpeg'
  // const filePath = path.join(process.cwd(), filename)
  // const file = fs.createReadStream(filePath)

  interface ContentItem {
    type: 'text' | 'image_url';
    text?: string;        // Optional for 'type' === 'text'
    image_url?: string;   // Optional for 'type' === 'image_url'
  }

  try {
    const chatCompletion = await openai.createChatCompletion({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          ['content' as any]: [
            {type: 'text', text: "What's in this image?"},
            {type: 'image_url', image_url: `data:image/jpeg;base64,${base64Image}`}
          ],
        },
      ],
      max_tokens: 300,
    });
    const result = chatCompletion.data.choices[0].message?.content;
    console.log(result)
    res.status(200).json({ result });
  } catch (error: any) {
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
