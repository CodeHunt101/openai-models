import { FormEvent } from "react";

type TextAreaProps = {
  input: string, 
  onChange: (e: FormEvent<HTMLTextAreaElement>) => void
}

export const TextArea = ({ input, onChange }: TextAreaProps) => (
  <>
    <textarea
      value={input}
      onChange={onChange}
      className="textarea textarea-primary textarea-lg"
    ></textarea>
  </>
)
