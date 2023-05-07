import { FormEvent, useState } from 'react'
import Form from '@/components/form'
import TextResult from '@/components/textResult'
import { submitRequest } from '@/utils/api'

export default function Chat() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    try {
      const result = await submitRequest('/api/chat', input)
      setResult(result)
      setInput('')
    } catch (error: any) {
      // Consider implementing your own error handling logic here
      console.error(error)
      alert(error.message)
    }
  }
  const handleChange = (e: React.FormEvent<HTMLInputElement>) =>
    setInput((e.target as HTMLFormElement).value)

  return (
    <div className="flex flex-col items-center mt-5">
      <h1>CHAT</h1>
      <Form input={input} handleChange={handleChange} handleSubmit={onSubmit} />
      {result && <TextResult result={result} />}
    </div>
  )
}
