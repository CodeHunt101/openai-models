import { FileFormat, FileType } from '@/types/enums'
import { FormEvent } from 'react'
import { Input } from '@/components/ui/input'

type FileInputProps = {
  fileType: FileType
  onChange: (e: FormEvent<HTMLInputElement>) => void
  style?: {
    marginAuto?: boolean
  }
}

export const FileInput = ({ fileType, onChange, style }: FileInputProps) => (
  <Input
    type="file"
    id="file-input"
    name={fileType}
    className={`w-full max-w-xs cursor-pointer ${
      style?.marginAuto ? 'm-auto' : 'm-0'
    }`}
    accept={fileType === FileType.IMAGE ? FileFormat.IMAGE : FileFormat.AUDIO}
    onChange={onChange}
    multiple={fileType === FileType.IMAGE}
  />
)
