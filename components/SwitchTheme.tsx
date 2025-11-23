import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

const SwitchTheme = () => {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <FontAwesomeIcon icon={faSun} className="text-xl opacity-0" />
      </Button>
    )
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {resolvedTheme === 'dark' ? (
        <FontAwesomeIcon icon={faSun} className="text-xl" />
      ) : (
        <FontAwesomeIcon icon={faMoon} className="text-xl" />
      )}
    </Button>
  )
}

export default SwitchTheme
