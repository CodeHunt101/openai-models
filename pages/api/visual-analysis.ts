import OpenAI from "openai";
import fs, { PathLike } from 'fs';
import path from 'path';
import formidable from 'formidable';
import { pollForFile, encodeImage } from '../../utils/helpers';
import { NextApiRequest, NextApiResponse } from 'next';

// Constants
const POLL_INTERVAL = 1000; // 1 second
const POLL_TIMEOUT = 60000;

export const config = {
  api: {
    bodyParser: false,
  },
};

const openai = new OpenAI();

export default async function visualAnalysis(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const form = formidable({});
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err);
      return;
    }
    const prompt = fields.prompt?.[0] as string;
    console.log({ service: 'Visual Analysis', date: new Date().toLocaleString(), prompt });
    // Verify prompt is not empty
    if (prompt?.trim().length === 0) {
      return res.status(400).json({
        error: {
          message: 'Please enter a valid prompt',
        },
      });
    }
    const uploadedFile = files.file;
    if (
      !uploadedFile ||
      !uploadedFile[0] ||
      uploadedFile[0].size === 0 ||
      uploadedFile[0].size > 2e7
    ) {
      return res.status(400).json({
        error: {
          message: 'Please upload a valid file',
        },
      });
    }
    const originalImagePath = uploadedFile[0].filepath;
    let imagePath;
    let fileType;
    try {
      // Get the file extension from the content type
      const contentType = uploadedFile[0].mimetype;
      const contentTypeParts = contentType?.split('/');
      fileType = contentTypeParts?.[1];

      // Ensure a valid file type is obtained
      if (!fileType) {
        throw new Error('Unable to determine file type');
      }
      await fs.promises.rename(originalImagePath, `tempImage.${fileType}`);
      imagePath = path.join(process.cwd(), `tempImage.${fileType}`);

      // Poll for the final image
      await pollForFile(imagePath, POLL_INTERVAL, POLL_TIMEOUT);

      const base64Image = encodeImage(imagePath);

      const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {url: `data:image/jpeg;base64,${base64Image}`},
              },
            ],
          },
        ],
        max_tokens: 600,
      });
      const result = chatCompletion.choices[0].message?.content;
      console.log(result);

      res.status(200).json({ result });
    } catch (error: any) {
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
        await fs.promises.unlink(imagePath as PathLike);
      } catch (unlinkError: any) {
        console.error(`Error deleting image: ${unlinkError.message}`);
      }
    }
  });
}
