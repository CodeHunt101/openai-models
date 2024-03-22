import { FileFormat, FileType } from '@/types/types'
import { FormEvent } from 'react'

type FileInputProps = {
  fileType: FileType
  onChange: (e: FormEvent<HTMLInputElement>) => void
  style?: {
    marginAuto?: boolean
  }
}

export const FileInput = ({ fileType, onChange, style }: FileInputProps) => (
  <input
    type="file"
    id="file-input"
    name={fileType}
    className={`file-input file-input-bordered w-full max-w-xs ${style?.marginAuto ? 'm-auto' : 'm-0'}`}
    accept={fileType === FileType.IMAGE ? FileFormat.IMAGE : FileFormat.AUDIO }
    onChange={onChange}
  />
)
