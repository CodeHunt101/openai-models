import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { Button, ButtonProps } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface SubmitButtonProps extends ButtonProps {
  loading: boolean
}

const SubmitButton = ({ loading, className, disabled, ...props }: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={loading || disabled}
      className={`w-full sm:w-auto ${className || ''}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FontAwesomeIcon icon={faPaperPlane} />
      )}
    </Button>
  )
}

export default SubmitButton
