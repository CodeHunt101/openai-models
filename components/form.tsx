import { faRobot } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type FormProps = {
  input: string;
  handleChange: (event: React.FormEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const Form = ({input, handleChange ,handleSubmit}: FormProps) => {
  
  return (
    <form onSubmit={handleSubmit} className="form-control w-full max-w-lg">
        <FontAwesomeIcon icon={faRobot} />
        <label className="label">
          <span className="label-text">Enter your prompt</span>
        </label>
        <input
          value={input}
          onChange={handleChange}
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full"
        />
        <label className="label"></label>
        <div className="flex justify-center">
          <button className="btn btn-primary">Generate response</button>
        </div>
      </form>
  )
}

export default Form