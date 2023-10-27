import { FormEvent, useState } from 'react'
import Form from '@/components/form'
import TextResult from '@/components/textResult'
import { submitRequest } from '@/utils/api'

export default function Completions() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setResult('')
    setLoading(true)
    try {
      const result = await submitRequest('/api/completions', input)
      if (result) {
        setResult(result)
        setLoading(false)
      }
      setInput('')
    } catch (error: any) {
      // Consider implementing your own error handling logic here
      console.error(error)
      setResult('Some error occured, please try again')
      setLoading(false)
      alert(error.message)
    }
  }

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => setInput((e.target as HTMLFormElement).value)

  return (
    <div className="flex flex-col items-center mt-5">
      <h1>COMPLETIONS</h1>
      <Form input={input} handleChange={handleChange} handleSubmit={onSubmit}/>
      {loading && <span className="loading loading-dots loading-lg"></span>}
      {result && <TextResult result={result} />}
    </div>
  )
}
