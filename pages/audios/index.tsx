import { FormEvent, useState } from 'react'
import Form from '@/components/form'
import TextResult from '@/components/textResult'
import { submitRequest } from '@/utils/api'

export default function Audios() {
  // const [input, setInput] = useState('')
  const [result, setResult] = useState('')

  // async function onSubmit(event) {
  //   event.preventDefault()
  //   try {
      
  //     const target = event.target[0]

  //     console.log({target})
  //     // setResult(result)
  //     setInput('')
  //   } catch (error: any) {
  //     // Consider implementing your own error handling logic here
  //     console.error(error)
  //     alert(error.message)
  //   }
  // }
  // const handleChange = (e: React.FormEvent<HTMLInputElement>) =>
  //   setInput((e.target as HTMLFormElement).value)

  const handleClick = async() => {
    try {
      const response = await fetch('/api/audios')
  
      const data = await response.json()
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        )
      }
      setResult(data.text)
      // setInput('')
    } catch (error: any) {
      // Consider implementing your own error handling logic here
      console.error(error)
      alert(error.message)
    }
  }

  return (
    <div className="flex flex-col items-center mt-5">
      <h1>TRANSCRIPT</h1>
      {/* <Form input={input} handleChange={handleChange} handleSubmit={onSubmit} /> */}
      {/* <input type="file" className="file-input w-full max-w-xs" /> */}
      <button onClick={handleClick}>Generate transcript</button>
      {result && <TextResult result={result} />}
    </div>
  )
}
