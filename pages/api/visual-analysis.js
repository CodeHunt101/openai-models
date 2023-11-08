import { Configuration, OpenAIApi } from 'openai';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

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
    res.status(500).json({
      error: {
        message:
          'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
    return;
  }

  function pollForFile(filePath, interval, timeout) {
    const start = Date.now();

    return new Promise((resolve, reject) => {
      const checkFile = () => {
        fs.access(filePath, fs.constants.R_OK, (err) => {
          if (!err) {
            // File exists and is readable
            resolve(filePath);
            return filePath;
          } else if (Date.now() - start >= timeout) {
            reject(
              new Error(
                `File not found within the specified timeout: ${filePath}`
              )
            );
          } else {
            // Continue polling
            setTimeout(checkFile, interval);
          }
        });
      };

      checkFile();
    });
  }

  function encodeImage(imagePath) {
    try {
      const imageBuffer = fs.readFileSync(imagePath);
      // console.log({ imageBuffer });
      const base64Image = imageBuffer.toString('base64');
      // console.log({ base64Image });
      return base64Image;
    } catch (error) {
      console.error(`Error encoding image: ${error.message}`);
      return null;
    }
  }

  const imageName = 'dad.jpeg';
  // const imagePath = path.join(process.cwd(), imageName);
  // const base64Image = encodeImage(imagePath);

  try {
    let filePath;

    if (req.method === 'POST') {
      const form = formidable({});
      form.parse(req, (err, fields, files) => {
        const uploadedFile = files.file;
        filePath = uploadedFile[0].filepath;
        fs.rename(filePath, `tempImage.jpeg`, (moveErr) => {
          if (moveErr) {
            console.error(moveErr);
            return res
              .status(500)
              .json({ error: 'Error moving the uploaded file' });
          }
        });
      });
    }

    const imagePath = path.join(process.cwd(), 'tempImage.jpeg');
    console.log({ imagePath });
    const pollInterval = 1000; // 1 second
    const pollTimeout = 60000; // 60 seconds

    const filepath2 = await pollForFile(imagePath, pollInterval, pollTimeout);

    const base64Image = encodeImage(filepath2);
    console.log({ base64Image });
    const chatCompletion = await openai.createChatCompletion({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          ['content']: [
            { type: 'text', text: "What's in this image?" },
            {
              type: 'image_url',
              image_url: `data:image/jpeg;base64,${base64Image}`,
            },
          ],
        },
      ],
      max_tokens: 300,
    });
    const result = chatCompletion.data.choices[0].message?.content;
    console.log(result);
    res.status(200).json({ result });
    fs.unlinkSync(imagePath)
  } catch (error) {
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
