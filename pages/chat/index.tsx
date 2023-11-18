import { FormEvent, useState } from 'react'
import Form from '@/components/form'
import TextResult from '@/components/textResult'
import { submitRequest } from '@/utils/api'

export default function Chat() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState('')

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setPrompt('')
    setResult('')
    setLoading(true)
    try {
      const result = await submitRequest('/api/chat', input)
      if (result) {
        setPrompt(input)
        setResult(result)
        setLoading(false)
      }
      setInput('')
    } catch (error: any) {
      console.error(error)
      setResult('Some error occured, please try again')
      setLoading(false)
      alert(error.message)
    }
  }
  const handleChange = (
    e: React.FormEvent<HTMLTextAreaElement> | React.FormEvent<HTMLInputElement>
  ) => setInput((e.target as HTMLFormElement).value)

  return (
    <div className="flex flex-col items-center mt-5">
      <h2>CHAT</h2>
      <Form
        input={input}
        handleChange={handleChange}
        handleSubmit={onSubmit}
        loading={loading}
      />
      {loading && <span className="loading loading-dots loading-lg"></span>}
      {result && <TextResult prompt={prompt} result={result} />}
    </div>
  )
}
