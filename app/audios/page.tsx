'use client';

import { FormEvent, useState } from 'react'
import TextResult from '@/components/TextResult'
import { Loading } from '@/components/Loading'
import AudioForm from './AudioForm'
import useAudioForm from './hooks/useAudioForm'
import { Badge } from '@/components/ui/badge'

export default function Audios() {
  const {
    handleAudioChange,
    handleSubmit,
    loading,
    result
  } = useAudioForm()

  return (
    <div className="flex flex-col items-center mt-5 space-y-4">
      <Badge variant="default" className="text-lg p-2 px-4 mb-5">
        Voice Transcription
      </Badge>
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
