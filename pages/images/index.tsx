import { FormEvent, useState } from 'react'
import Image from 'next/image'
import Form from '@/components/form'
import { submitRequest } from '@/utils/api'

export default function Images() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<{ url: string }[] | string>([])
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setResult('')
    setLoading(true)
    try {
      const result = await submitRequest('/api/images', input)
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

  const handleChange = (e: React.FormEvent<HTMLInputElement>) =>
    setInput((e.target as HTMLFormElement).value)

  return (
    <div className="flex flex-col items-center mt-5">
      <h1>IMAGE</h1>
      <Form input={input} handleChange={handleChange} handleSubmit={onSubmit} />
      {loading && <span className="loading loading-dots loading-lg"></span>}
      {Array.isArray(result) && result.map((image, idx) => (
        <Image
          key={idx}
          className="max-w-md m-5"
          alt={'image'}
          src={image.url}
          width={1024}
          height={1024}
        />
      ))}
    </div>
  )
}
