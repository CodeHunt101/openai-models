import { FormEvent, useState } from 'react'
import TextResult from '@/components/TextResult'
import { Loading } from '@/components/Loading'
import AudioForm from './AudioForm'
import useAudioForm from './hooks/useAudioForm'

export default function Audios() {
  const {
    handleAudioChange,
    handleSubmit,
    loading,
    result
  } = useAudioForm()

  return (
    <div className="flex flex-col items-center mt-5">
      <div className="badge badge-primary text-lg p-5 mb-5">
        Voice Transcription
      </div>
      <AudioForm
        loading={loading}
        onSubmit={handleSubmit}
        onAudioChange={handleAudioChange}
      />
      {loading && <Loading />}
      {result && <TextResult messages={result} />}
    </div>
  )
}
