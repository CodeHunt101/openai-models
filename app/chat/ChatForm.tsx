import { FileInput } from '@/components/FileInput'
import SubmitButton from '@/components/SubmitButton'
import TextArea from '@/components/TextArea'
import { FileType } from '@/types/enums'
import { FormEvent } from 'react'
import { Label } from '@/components/ui/label'

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
    className="w-full max-w-lg space-y-4"
    encType="multipart/form-data"
  >
    <div className="grid w-full items-center gap-1.5">
      <Label>Enter your prompt</Label>
      <TextArea input={input} onChange={onTextChange} />
    </div>
    <FileInput fileType={FileType.IMAGE} onChange={onImageChange} />
    <SubmitButton
      loading={loading}
      disabled={loading || input.length < 2}
    />
  </form>
)

export default ChatForm