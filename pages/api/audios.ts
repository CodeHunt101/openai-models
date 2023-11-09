import { Configuration, OpenAIApi } from 'openai'
import fs, { PathLike } from 'fs'
import path from 'path'
import formidable from 'formidable';
import { pollForFile } from '../../utils/helpers';
import { NextApiRequest, NextApiResponse } from 'next';



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
})
const openai = new OpenAIApi(configuration)

export default async function audios(req: NextApiRequest, res: NextApiResponse) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          'OpenAI API key not configured, please follow instructions in README.md',
      },
    })
    return
  }

  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err);
      return;
    }
    const uploadedFile = files.file;
    if (
      !uploadedFile ||
      !uploadedFile[0] ||
      uploadedFile[0].size === 0
    ) {
      return res.status(400).json({
        error: {
          message: 'Please upload a valid file',
        },
      });
    }
    const originalAudioPath = uploadedFile[0].filepath;
    let audioPath
    try {
      await fs.promises.rename(originalAudioPath, 'tempAudio.m4a');
      audioPath = path.join(process.cwd(), 'tempAudio.m4a');

      // Poll for the final audio
      await pollForFile(audioPath, POLL_INTERVAL, POLL_TIMEOUT);

      const audioFile = fs.createReadStream(audioPath)

      const audioTranscription = await openai.createTranscription(
        audioFile as unknown as File,
        'whisper-1'
      )
        
      const result = audioTranscription.data.text;
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
      // Remove the temporary audio file
      try {
        await fs.promises.unlink(audioPath as PathLike);
      } catch (unlinkError: any) {
        console.error(`Error deleting audio: ${unlinkError.message}`);
      }
    }
  })
}
