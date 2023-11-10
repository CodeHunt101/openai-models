import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import formidable from 'formidable';
import { isUploadedFileValid, pollForFile } from '../../utils/helpers';
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

export default async function audios(req: NextApiRequest, res: NextApiResponse) {

  console.log({ service: 'Audio transcription', date: new Date().toLocaleString() });

  const form = formidable({});

  form.parse(req, async (err, _fields, files) => {
    if (err) {
      console.log(err);
      return;
    }
    const uploadedFile = files.file;
    if (!uploadedFile) return;

    const uploadedFileValidity = isUploadedFileValid(uploadedFile, res);
    if (!uploadedFileValidity) return;

    const originalAudioPath = uploadedFile[0].filepath;
    
    let audioPath, fileType;
    const currentTime = Date.now()

    try {
      // Get the file extension from the content type
      const contentType = uploadedFile[0].mimetype;
      const contentTypeParts = contentType?.split('/');
      fileType = contentTypeParts?.[1];

      // Ensure a valid file type is obtained
      if (!fileType) {
        throw new Error('Unable to determine file type');
      }
      await fs.promises.rename(originalAudioPath, `tempAudio-${currentTime}.${fileType}`);
      audioPath = path.join(process.cwd(), `tempAudio-${currentTime}.${fileType}`);

      // Poll for the final audio
      await pollForFile(audioPath, POLL_INTERVAL, POLL_TIMEOUT);

      const audioFile = fs.createReadStream(audioPath)

      const audioTranscription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1'
      }
      )
        
      const result = audioTranscription.text;
      console.log({result});

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
    } 
    // finally {
    //   // Remove the temporary audio file
    //   try {
    //     await fs.promises.unlink(audioPath as PathLike);
    //   } catch (unlinkError: any) {
    //     console.error(`Error deleting audio: ${unlinkError.message}`);
    //   }
    // }
  })
}
