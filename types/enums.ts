export enum ChatCompletionModel {
  GPT_4_0125_PREVIEW = 'gpt-4-0125-preview',
  GPT_4_1106_PREVIEW = 'gpt-4-1106-preview',
  GPT_4_VISION_PREVIEW = 'gpt-4-vision-preview',
  GPT_4 = 'gpt-4',
  GPT_4_0314 = 'gpt-4-0314',
  GPT_4_0613 = 'gpt-4-0613',
  GPT_4_32K = 'gpt-4-32k',
  GPT_4_32K_0314 = 'gpt-4-32k-0314',
  GPT_4_32K_0613 = 'gpt-4-32k-0613',
  GPT_3_5_TURBO = 'gpt-3.5-turbo',
  GPT_3_5_TURBO_16K = 'gpt-3.5-turbo-16k',
  GPT_3_5_TURBO_0301 = 'gpt-3.5-turbo-0301',
  GPT_3_5_TURBO_0613 = 'gpt-3.5-turbo-0613',
  GPT_3_5_TURBO_16K_0613 = 'gpt-3.5-turbo-16k-0613',
}

export enum ImageGenerationModel {
  DALL_E_3 = 'dall-e-3',
  DALL_E_2 = 'dall-e-2',
}

export enum AudioTranscriptionModel {
  WHISPER_1 = "'whisper-1",
}

export enum FileType {
  IMAGE = 'image',
  AUDIO = 'audio',
}

export enum FileFormat {
  IMAGE = '.png, .jpeg, .jpg, .webp, .gif',
  AUDIO = '.mp3, .mp4, .mpeg, .mpga, .m4a, .wav, .webm',
}