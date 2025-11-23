import React, { useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { Message } from '@/types/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard } from '@fortawesome/free-solid-svg-icons'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

type TextResultProps = {
  messages: Message[] | string
}

const TextResult = ({ messages }: TextResultProps) => {
  const assistantRef = useRef<HTMLDivElement>(null)

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed' // Prevent scrolling to bottom of page
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand('copy')
      if (successful) {
        toast.success('Copied to clipboard')
      } else {
        toast.error('Unable to copy')
      }
    } catch (err) {
      console.error('Fallback: Unable to copy', err)
      toast.error('Failed to copy to clipboard')
    }

    document.body.removeChild(textArea)
  }

  const copyToClipboard = () => {
    const textToCopy = assistantRef.current
      ? assistantRef.current.innerText
      : ''
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(textToCopy)
    } else {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          toast.success('Copied to clipboard')
        })
        .catch((err) => {
          console.error('Unable to copy text to clipboard', err)
          fallbackCopyTextToClipboard(textToCopy)
        })
    }
  }

  if (Array.isArray(messages)) {
    return (
      <>
        {messages.map(({ user, assistant }, index) => (
          <Card
            key={index}
            className="my-4 m-auto lg:w-2/3 shadow-lg self-start"
          >
            <CardContent className="p-6">
              <div className="my-2">
                <Badge variant="secondary" className="text-sm mb-2">You</Badge>
                <p id="user-prompt" className="ml-1 mb-4">
                  {user}
                </p>
              </div>
              <div className="my-2">
                <Badge variant="default" className="text-sm mb-2">Assistant</Badge>
                <div
                  id="asistant-response"
                  className="prose prose-neutral dark:prose-invert ml-1 max-w-fit"
                  ref={assistantRef}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                  >
                    {assistant}
                  </ReactMarkdown>
                </div>
                <div className="flex flex-row-reverse mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                    title="Copy to clipboard"
                  >
                    <FontAwesomeIcon
                      icon={faClipboard}
                    />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </>
    )
  }

  return (
    <Card className="my-4 m-auto lg:w-2/3 shadow-lg self-start">
      <CardContent className="p-6">
        <div className="my-2">
          <Badge variant="default" className="text-sm mb-2">Assistant</Badge>
          <div
            id="asistant-response"
            className="prose prose-neutral dark:prose-invert ml-1 max-w-fit"
            ref={assistantRef}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
            >
              {messages}
            </ReactMarkdown>
          </div>
          <div className="flex flex-row-reverse mt-2">
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              title="Copy to clipboard"
            >
              <FontAwesomeIcon
                icon={faClipboard}
              />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TextResult
