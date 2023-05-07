import { FormEvent, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot } from '@fortawesome/free-solid-svg-icons'
// import wordwrap from 'wordwrap'

export default function Chat() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    try {
      const response = await fetch('/api/chat', {
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

  // const formattedResult = wordwrap(80)(result || '')

  return (
    <div className="flex flex-col items-center mt-5">
      <h1>CHAT</h1>
      <form onSubmit={onSubmit} className="form-control w-full max-w-lg">
        <FontAwesomeIcon icon={faRobot} />
        <label className="label">
          <span className="label-text">Enter your prompt</span>
        </label>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full"
        />
        <label className="label"></label>
        <div className="flex justify-center">
          <button className="btn btn-primary">Generate response</button>
        </div>
      </form>
      {result && <div className="max-w-md m-5">{result.split('\n').map((line, index)=> (
        <div key={index}>
          {line}
          <br />
        </div>
      ))}</div>}
    </div>
  )
}
