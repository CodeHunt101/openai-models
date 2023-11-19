import { FormEvent, useState } from 'react'
import TextResult from '@/components/textResult'
import Image from 'next/image'
import { mapChatArray } from '@/utils/utils'
import { Message } from '../../types/types'
import { useRouter } from 'next/router'

export default function VisualAnalysis() {
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [input, setInput] = useState('')
  const [selectedImageURL, setSelectedImageURL] = useState('')
  const [messages, setMessages] = useState<Message[] | string>([])
  const router = useRouter()
  const { user } = router.query

  const onImageChange = (e: FormEvent<HTMLInputElement>) => {
    const fileInput = e.target as HTMLInputElement
    const file = fileInput.files?.[0]
    if (file) {
      const allowedExtensions = ['.png', '.jpeg', '.jpg', '.webp', '.gif']
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      if (allowedExtensions.includes(`.${fileExtension}`)) {
        setSelectedFile(file)
      } else {
        alert(
          'Invalid file type. Please select a PNG, JPEG, WEBP, or non-animated GIF file.'
        )
        fileInput.value = ''
      }
    }
  }

  const onTextChange = (e: FormEvent<HTMLTextAreaElement>) => {
    setInput((e.target as HTMLFormElement).value)
  }

  async function onSubmit(event: any) {
    event.preventDefault()
    setLoading(true)
    if (!selectedFile) {
      alert('Please add the file')
      setLoading(false)
      return
    }
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('prompt', input)
    formData.append('user', user as string)
    try {
      const response = await fetch('/api/visual-analysis', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        )
      }
      setSelectedImageURL(URL.createObjectURL(selectedFile))
      setMessages(
        mapChatArray(data.result) || 'No result returned from the API'
      )
      setInput('')
      // Reset the file input element here
      const fileInput = document.getElementById(
        'file-input'
      ) as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
      }
    } catch (error: any) {
      // Consider implementing your own error handling logic here
      console.error(error)
      alert(error.message)
    }
    setLoading(false)
  }

  const handleNewThread = async() => {
    const formData = new FormData()
    formData.append('deleteMessages', true.toString())
    formData.append('user', user as string)
    try {
      setLoading(true)
      await fetch('/api/visual-analysis', {
        method: 'POST',
        body: formData,
      })
      setMessages([])
    }
     catch (error) {
      console.error(error)
      setMessages('Some error occurred, please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center mt-5">
      <h2>VISUAL ANALYSIS</h2>
      <button onClick={handleNewThread} className="btn btn-accent my-2">Start New Thread</button>
      {loading && <span className="loading loading-dots loading-lg"></span>}
      {messages.length > 0 && (
        <>
          <Image
            src={selectedImageURL}
            alt="Selected Image"
            width={512}
            height={512}
            className="selected-image my-4"
          />
          <TextResult messages={messages} />
        </>
      )}
      <form
        method="post"
        onSubmit={onSubmit}
        className="form-control w-full max-w-lg"
        encType="multipart/form-data"
      >
        <label className="label">
          <span className="label-text">Enter your prompt</span>
        </label>
        <textarea
          value={input}
          onChange={onTextChange}
          className="textarea textarea-primary textarea-lg"
        ></textarea>
        <input
          type="file"
          id="file-input"
          name="image"
          className="file-input file-input-bordered w-full max-w-xs"
          accept=".png, .jpeg, .jpg, .webp, .gif"
          onChange={onImageChange}
        />
        <label className="label"></label>
        <div className="flex justify-center">
          <button className="btn btn-primary" disabled={loading}>
            Generate response
          </button>
        </div>
      </form>
    </div>
  )
}
