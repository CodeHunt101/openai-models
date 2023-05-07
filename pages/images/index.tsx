import { FormEvent, useState } from 'react'
import Image from 'next/image'
import Form from '@/components/form'

export default function Images() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    try {
      const response = await fetch('/api/images', {
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
      <h1>IMAGE</h1>
      <Form input={input} handleChange={handleChange} handleSubmit={onSubmit}/>
      {result && <Image className="max-w-md m-5" alt={'image'} src={result} width={1024} height={1024}/>}
    </div>
  )
}
