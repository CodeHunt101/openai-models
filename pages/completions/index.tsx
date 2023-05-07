import { FormEvent, useState } from 'react'
import Form from '@/components/form'
import TextResult from '@/components/textResult'

export default function Completions() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    try {
      const response = await fetch('/api/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      })

      const data = await response.json()
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        )
      }

      setResult(data.result)
      setInput('')
    } catch (error: any) {
      // Consider implementing your own error handling logic here
      console.error(error)
      alert(error.message)
    }
  }

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => setInput((e.target as HTMLFormElement).value)

  return (
    <div className="flex flex-col items-center mt-5">
      <h1>COMPLETIONS</h1>
      <Form input={input} handleChange={handleChange} handleSubmit={onSubmit}/>
      {result && <TextResult result={result} />}
    </div>
  )
}
