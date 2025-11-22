import { FileInput } from '@/components/FileInput'
import { SubmitButton } from '@/components/SubmitButton'
import { FileType } from '@/types/enums'
import { FormEvent } from 'react'

type AudioFormProps = {
  loading: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onAudioChange: (event: FormEvent<HTMLInputElement>) => void
}

const AudioForm = ({
  onSubmit,
  loading,
  onAudioChange,
}: AudioFormProps) => (
  <form
    method="post"
    onSubmit={onSubmit}
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