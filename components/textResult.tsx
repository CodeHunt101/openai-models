import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

type TextResultProps = {
  prompt?: string
  result: string
}

const TextResult = ({ prompt, result }: TextResultProps) => {
  return (
    <div className="self-start">
      {prompt && (
        <div className="max-w-xl m-5">
          <h3>User:</h3>
          <p className="my-5">{prompt}</p>
        </div>
      )}
      <div className="max-w-xl m-5">
        <h3>Assistant:</h3>
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
          {result}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default TextResult
