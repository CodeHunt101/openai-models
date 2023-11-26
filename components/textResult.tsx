import React, { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { Message } from '@/types/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard } from '@fortawesome/free-solid-svg-icons'

type TextResultProps = {
  messages: Message[] | string
}

const TextResult = ({ messages }: TextResultProps) => {
  const assistantRef = useRef<HTMLDivElement>(null)
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null)

  const copyToClipboard = () => {
    if (assistantRef.current) {
      const textToCopy = assistantRef.current.innerText
      navigator.clipboard.writeText(textToCopy).catch((err) => {
        console.error('Unable to copy text to clipboard', err)
      })
    }

    setTooltipMessage('Copied to clipboard')
    setTimeout(() => setTooltipMessage(null), 2000)
  }

  if (Array.isArray(messages)) {
    return (
      <>
        {messages.map(({ user, assistant }, index) => (
          <div
            key={index}
            className="card my-2 m-auto lg:w-2/3 shadow-lg self-start bg-primary"
          >
            <div className="card-body">
              <div className="my-1">
                <kbd className="kbd kbd-md">You</kbd>
                <p id="user-prompt" className="my-1 ml-1 text-primary-content">
                  {user}
                </p>
              </div>
              <div className="my-1">
                <kbd className="kbd kbd-md">Assistant</kbd>
                <div
                  id="asistant-response"
                  className="prose prose-neutral ml-1 min-w-fit"
                  ref={assistantRef}
                >
                  <ReactMarkdown
                    className="text-primary-content"
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                  >
                    {assistant}
                  </ReactMarkdown>
                </div>
                <div className="flex flex-row-reverse">
                  <div className="tooltip" data-tip={tooltipMessage}>
                    <button
                      onClick={copyToClipboard}
                      className="btn btn-square btn-outline border-primary bg-neutral-content hover:bg-neutral-content hover:border-neutral-content"
                    >
                      <FontAwesomeIcon
                        className="text-primary-content"
                        icon={faClipboard}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </>
    )
  }

  return (
    <div className="card my-2 m-auto lg:w-2/3 shadow-lg self-start bg-primary">
      <div className="card-body">
        <div className="my-1">
          <kbd className="kbd kbd-md">Assistant</kbd>
          <div
            id="asistant-response"
            className="prose prose-neutral ml-1 min-w-fit"
            ref={assistantRef}
          >
            <ReactMarkdown
              className="text-primary-content"
              remarkPlugins={[remarkGfm, remarkBreaks]}
            >
              {messages}
            </ReactMarkdown>
          </div>
          <div className="flex flex-row-reverse">
            <div className="tooltip" data-tip={tooltipMessage}>
              <button
                onClick={copyToClipboard}
                className="btn btn-square btn-outline border-primary bg-neutral-content hover:bg-neutral-content hover:border-neutral-content"
              >
                <FontAwesomeIcon
                  className="text-primary-content"
                  icon={faClipboard}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // return <p>{messages}</p>;
}

export default TextResult
