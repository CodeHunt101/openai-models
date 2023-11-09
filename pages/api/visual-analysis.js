import { Configuration, OpenAIApi } from 'openai';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import {pollForFile, encodeImage, verifyUploadedFile} from '../../utils/helpers'

// Constants
const POLL_INTERVAL = 1000; // 1 second
const POLL_TIMEOUT = 60000;

export const config = {
  api: {
    bodyParser: false,
  },
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function visualAnalysis(req, res) {
  if (!configuration.apiKey) {
    return res.status(500).json({
      error: {
        message:
          'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
  }

  const form = formidable({});
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err)
      return
    }
    const prompt = fields.prompt[0];
    console.log({ prompt });
    // Verify prompt is not empty
    if (prompt.trim().length === 0) {
      return res.status(400).json({
        error: {
          message: 'Please enter a valid prompt',
        },
      });
    }
    const originalImagePath = verifyUploadedFile(files, res)
    let imagePath
    try {
      await fs.promises.rename(originalImagePath, 'tempImage.jpeg');
      imagePath = path.join(process.cwd(), 'tempImage.jpeg');
      
      // Poll for the final image
      const finalImagePath = await pollForFile(imagePath, POLL_INTERVAL, POLL_TIMEOUT);
      
      const base64Image = encodeImage(finalImagePath);

      const chatCompletion = await openai.createChatCompletion({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: `data:image/jpeg;base64,${base64Image}`,
              },
            ],
          },
        ],
        max_tokens: 600,
      });
      const result = chatCompletion.data.choices[0].message?.content;
      console.log(result);
      
      res.status(200).json({ result });
      
    } catch (error) {
      if (error.response) {
        console.error(error.response.status, error.response.data);
        res.status(error.response.status).json(error.response.data);
      } else {
        console.error(error.message);
        res.status(500).json({
          error: {
            message: error.message,
          },
        });
      }
    } finally {
      // Remove the temporary image file
      try {
        await fs.promises.unlink(imagePath);
      } catch (unlinkError) {
        console.error(`Error deleting image: ${unlinkError.message}`);
      }
    }
  });
}
