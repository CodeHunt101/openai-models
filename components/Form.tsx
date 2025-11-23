import { FormEvent, useEffect, useState } from 'react'
import TextArea from './TextArea'
import SubmitButton from './SubmitButton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type FormProps = {
  input: string
  loading: boolean
  onChange: (
    event: FormEvent<HTMLTextAreaElement> | FormEvent<HTMLInputElement>
  ) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}
const Form = ({ input, onChange, onSubmit, loading }: FormProps) => {
  const [path, setPath] = useState('')
  useEffect(() => {
    setPath(window.location.pathname)
  }, [])

  return (
    <form onSubmit={onSubmit} className="w-full max-w-lg space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label>Enter your prompt</Label>
        {path === '/audios' ? (
          <Input
            value={input}
            onChange={onChange}
            type="file"
            placeholder="Type here"
            className="w-full max-w-xs cursor-pointer"
          />
        ) : (
          <TextArea input={input} onChange={onChange} />
        )}
      </div>
      <SubmitButton
        loading={loading}
        disabled={loading || input.length < 2}
      />
    </form>
  )
}

export default Form
