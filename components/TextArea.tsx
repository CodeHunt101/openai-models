import { FormEvent } from 'react'
import { Textarea } from '@/components/ui/textarea'

type TextAreaProps = {
  input: string
  onChange: (event: FormEvent<HTMLTextAreaElement>) => void
}

const TextArea = ({ input, onChange }: TextAreaProps) => {
  return (
    <Textarea
      className="h-24 w-full"
      placeholder="Type here"
      value={input}
      onChange={onChange}
    />
  )
}

export default TextArea
