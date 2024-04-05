import { FormEvent, useEffect, useState } from 'react'
import { TextArea } from './TextArea'
import { SubmitButton } from './SubmitButton'

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
    <form onSubmit={onSubmit} className="form-control w-full max-w-lg">
      <label className="label">
        <span className="label-text">Enter your prompt</span>
      </label>
      {path === '/audios' ? (
        <input
          value={input}
          onChange={onChange}
          type={path === '/audios' ? 'file' : 'text'}
          placeholder="Type here"
          className={
            path === '/audios'
              ? 'file-input w-full max-w-xs'
              : 'input input-bordered w-full'
          }
        />
      ) : (
        <TextArea input={input} onChange={onChange} />
      )}
      <label className="label"></label>
      <SubmitButton
        title="Generate response"
        disabled={loading || input.length < 2}
      />
    </form>
  )
}

export default Form
