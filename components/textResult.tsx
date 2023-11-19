import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { Message } from '@/types/types'

type TextResultProps = {
  messages: Message[] | string
}

const TextResult = ({ messages }: TextResultProps) => {
  if (Array.isArray(messages)) {
    return (
      <>
        {messages.map(({ user, assistant }, index) => (
          <div
            key={index}
            className="card my-2 w-full shadow-lg self-start bg-primary"
          >
            <div className="card-body">
              {
                <div className="max-w-xl my-1">
                  <kbd className="kbd kbd-md">You</kbd>
                  <p className="my-1 ml-1 text-primary-content">{user}</p>
                </div>
              }
              {
                <div className="max-w-xl my-1">
                  <kbd className="kbd kbd-md">Assistant</kbd>
                  <div className="prose prose-neutral ml-1">
                    <ReactMarkdown
                      className="text-primary-content"
                      remarkPlugins={[remarkGfm, remarkBreaks]}
                    >
                      {assistant}
                    </ReactMarkdown>
                  </div>
                </div>
              }
            </div>
          </div>
        ))}
      </>
    )
  }

  return <p>{messages}</p>
}

export default TextResult
