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
                <div className="max-w-xl">
                  <h3 className="card-title">User:</h3>
                  <p className="my-1">{user}</p>
                </div>
              }
              {
                <div className="max-w-xl">
                  <h3 className="card-title">Assistant:</h3>
                  <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                    {assistant}
                  </ReactMarkdown>
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
