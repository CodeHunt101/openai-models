import { FileInput } from '@/components/FileInput'
import SubmitButton from '@/components/SubmitButton'
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
    className="w-full max-w-lg space-y-4"
    encType="multipart/form-data"
  >
    <div className="grid w-full items-center gap-1.5">
      <FileInput
        fileType={FileType.AUDIO}
        onChange={onAudioChange}
        style={{ marginAuto: true }}
      />
    </div>
    <SubmitButton loading={loading} />
  </form>
)

export default AudioForm