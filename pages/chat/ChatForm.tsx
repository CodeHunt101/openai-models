import { FileInput } from '@/components/FileInput'
import { SubmitButton } from '@/components/SubmitButton'
import { TextArea } from '@/components/TextArea'
import { FileType } from '@/types/enums'
import { FormEvent } from 'react'

type ChatFormProps = {
  input: string
  loading: boolean
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
  onTextChange: (event: FormEvent<HTMLTextAreaElement>) => void
  onImageChange: (event: FormEvent<HTMLInputElement>) => void
}

const ChatForm = ({
  input,
  handleSubmit,
  onTextChange,
  loading,
  onImageChange,
}: ChatFormProps) => (
  <form
    method="post"
    onSubmit={handleSubmit}
    className="form-control w-full max-w-lg"
    encType="multipart/form-data"
  >
    <label className="label">
      <span className="label-text">Enter your prompt</span>
    </label>
    <TextArea input={input} onChange={onTextChange} />
    <FileInput fileType={FileType.IMAGE} onChange={onImageChange} />
    <label className="label"></label>
    <SubmitButton
      title="Generate response"
      disabled={loading || input.length < 2}
    />
  </form>
)

export default ChatForm