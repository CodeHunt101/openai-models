type TextResultProps = {
  result: string
}

const TextResult = ({result}: TextResultProps) => {
  return (
      <div className="max-w-md m-5">
        {result.split('\n').map((line, index) => (
          <div key={index}>
            {line}
            <br />
          </div>
        ))}
      </div>
    )
  
}

export default TextResult