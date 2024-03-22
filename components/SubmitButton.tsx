type SubmitButtonProps = {
  title: string
  disabled: boolean
}

export const SubmitButton = ({ title, disabled }: SubmitButtonProps) => (
  <div className="flex justify-center">
    <button className="btn btn-primary" disabled={disabled}>
      {title}
    </button>
  </div>
)
