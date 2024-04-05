import { FormEvent, useState } from 'react'
import TextResult from '@/components/TextResult'
import { Loading } from '@/components/Loading'
import AudioForm from './AudioForm'

export default function Audios() {
  const [result, setResult] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const onAudioChange = (e: React.FormEvent<HTMLInputElement>) => {
    const fileInput = e.target as HTMLInputElement
    const file = fileInput.files?.[0]
    if (file) {
      const allowedExtensions = [
        '.mp3',
        '.mp4',
        '.mpeg',
        '.mpga',
        '.m4a',
        '.wav',
        '.webm',
      ]
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      if (allowedExtensions.includes(`.${fileExtension}`)) {
        setSelectedFile(file)
      } else {
        alert('Invalid file type. Please select an audio file.')
        fileInput.value = ''
      }
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    if (!selectedFile) {
      alert('Please add the file')
      setLoading(false)
      return
    }
    const formData = new FormData()
    formData.append('file', selectedFile)
    try {
      const response = await fetch('/api/audios', {
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
      setResult(data.result)
      setSelectedFile(null)
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

  return (
    <div className="flex flex-col items-center mt-5">
      <div className="badge badge-primary text-lg p-5 mb-5">
        Voice Transcription
      </div>
      <AudioForm
        loading={loading}
        onSubmit={handleSubmit}
        onAudioChange={onAudioChange}
      />
      {loading && <Loading />}
      {result && <TextResult messages={result} />}
    </div>
  )
}
