import {
  faComments,
  faPenClip,
  faRobot,
  faFileAudio,
} from '@fortawesome/free-solid-svg-icons'
import { faImages } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'

type FormProps = {
  input: string
  loading: boolean
  handleChange: (event: React.FormEvent<HTMLTextAreaElement> | React.FormEvent<HTMLInputElement>) => void
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}
// const path = window.location.pathname
const Form = ({ input, handleChange, handleSubmit, loading }: FormProps) => {
  const [path, setPath] = useState('')
  useEffect(() => {
    setPath(window.location.pathname)
  }, [])

  const defineIcon = (path: string) =>
    ({
      '/chat': <FontAwesomeIcon icon={faComments} />,
      '/completions': <FontAwesomeIcon icon={faPenClip} />,
      '/images': <FontAwesomeIcon icon={faImages} />,
      '/audios': <FontAwesomeIcon icon={faFileAudio} />,
    }[path])

  return (
    <form onSubmit={handleSubmit} className="form-control w-full max-w-lg">
      {defineIcon(path)}
      <label className="label">
        <span className="label-text">Enter your prompt</span>
      </label>
      {path === '/audios' ? <input
        value={input}
        onChange={handleChange}
        type={path === '/audios' ? 'file' : 'text'}
        placeholder="Type here"
        className={
          path === '/audios'
            ? 'file-input w-full max-w-xs'
            : 'input input-bordered w-full'
        }
      /> : <textarea value={input} onChange={handleChange} className="textarea textarea-primary textarea-lg"></textarea>}
      <label className="label"></label>
      <div className="flex justify-center">
        <button className="btn btn-primary" disabled={loading}>Generate response</button>
      </div>
    </form>
  )
}

export default Form
