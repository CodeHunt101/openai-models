import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

type TextResultProps = {
  result: string
}

const TextResult = ({ result }: TextResultProps) => {
  return (
    <div className="max-w-xl m-5">
      <div className="prose prose-slate">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
          {result}
        </ReactMarkdown>
      </div>
      {/* <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
          {result}
        </ReactMarkdown> */}
      {/* {result.split('\n').map((line, index) => (
          <div key={index}>
            {line}
            <br />
          </div>
        ))} */}
      {/* {result.split('\n').map((line, index) => (
          <div key={index}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{line}</ReactMarkdown> 
            <br />
          </div>
        ))} */}
    </div>
  )
}

export default TextResult
