import formidable from 'formidable';
import fs from 'fs';
import { NextApiResponse } from 'next';

export const generatePrompt = (prompt: string) => {
  console.log({ prompt })
  const capitalizedPrompt =
    prompt[0].toUpperCase() + prompt.slice(1).toLowerCase()
  return capitalizedPrompt
}

export const pollForFile = (filePath: string, interval: number, timeout: number) => {
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
};

export const encodeImage = (imagePath: string) => {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    return base64Image;
  } catch (error: any) {
    console.error(`Error encoding image: ${error.message}`);
    return null;
  }
};

export const verifyUploadedFile = (files: formidable.Files<string>, res: NextApiResponse) => {
  const uploadedFile = files.file;
    if (!uploadedFile || !uploadedFile[0] || uploadedFile[0].size === 0 || uploadedFile[0].size > 2e+7) {
      return res.status(400).json({
        error: {
          message: 'Please upload a valid file',
        },
      });
    }
  return uploadedFile[0].filepath
}