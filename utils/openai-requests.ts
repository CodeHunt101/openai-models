import {
  AudioTranscriptionModel,
  ChatCompletionModel,
  ImageGenerationModel,
} from '@/types/enums'
import { ReadStream } from 'fs'
import OpenAI from 'openai'
import {
  ChatCompletionContentPart,
  ChatCompletionMessageParam,
} from 'openai/resources'

export const getChatCompletion = async (
  messages: ChatCompletionMessageParam[],
  model: ChatCompletionModel,
  openai: OpenAI
) =>
  await openai.chat.completions.create({
    model,
    messages,
    temperature: 0.8,
  })

export const getChatCompletionWithVisuals = async (
  prompt: string,
  model: ChatCompletionModel,
  base64Images: string[],
  openai: OpenAI
) => {
  const imageContents: ChatCompletionContentPart[] = base64Images.map(
    (base64Image) => ({
      type: 'image_url',
      image_url: { url: `data:image/jpeg;base64,${base64Image}` },
    })
  )
  return await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'user',
        content: [{ type: 'text', text: prompt }, ...imageContents],
      },
    ],
    max_tokens: 600,
  })
}

export const getImageGeneration = async (
  prompt: string,
  model: ImageGenerationModel,
  openai: OpenAI
) =>
  await openai.images.generate({
    model,
    prompt,
    n: 1,
    size: '1024x1024',
    quality: 'hd',
  })

export const getAudioTranscription = async (
  file: ReadStream,
  model: AudioTranscriptionModel,
  openai: OpenAI
) =>
  await openai.audio.transcriptions.create({
    file,
    model,
  })
