import Head from 'next/head'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot } from '@fortawesome/free-solid-svg-icons'

export default function Gpt35turbo() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState()

  async function onSubmit(event) {
    event.preventDefault()
    try {
      // const response = await fetch("/api/generate", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ prompt: input }),
      // });

      // const data = await response.json();
      // if (response.status !== 200) {
      //   throw data.error || new Error(`Request failed with status ${response.status}`);
      // }

      // setResult(data.result);
      setResult('It works')
      setInput('')
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error)
      alert(error.message)
    }
  }

  return (
    <div className='flex justify-center'>
      <form onSubmit={onSubmit} className="form-control w-full max-w-xs">
        <FontAwesomeIcon icon={faRobot} />
        <label className="label">
          <span className="label-text">Enter your prompt</span>
        </label>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
        />
        <label className="label"></label>
        <button className="btn btn-primary">Geberate response</button>
      </form>
      <div>{result}</div>
    </div>
  )
}
