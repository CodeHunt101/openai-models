import { FileInput } from '@/components/FileInput'
import { SubmitButton } from '@/components/SubmitButton'
import { FileType } from '@/types/enums'
import { FormEvent } from 'react'

type AudioFormProps = {
  loading: boolean
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
  onAudioChange: (event: React.FormEvent<HTMLInputElement>) => void
}

const AudioForm = ({
  handleSubmit,
  loading,
  onAudioChange,
}: AudioFormProps) => (
  <form
    method="post"
    onSubmit={handleSubmit}
    className="form-control w-full max-w-lg"
    encType="multipart/form-data"
  >
    <FileInput
      fileType={FileType.AUDIO}
      onChange={onAudioChange}
      style={{ marginAuto: true }}
    />
    <label className="label"></label>
    <SubmitButton title="Generate transcript" disabled={loading} />
  </form>
)

export default AudioForm