export type Message = { user?: string; assistant?: string }
export type MessageWithAuthUser = {
  role: string
  content: string
  user: string
}

//USE IN THE FUTURE
// type PromptItem = {
//   type: 'text' | 'image_url';
//   text?: string;
//   image_url?: { url: string } | null;
// }
// export type MessageWithImageAndAuthUser = {
//   role: string;
//   content: PromptItem[];
//   user: string;
// }
