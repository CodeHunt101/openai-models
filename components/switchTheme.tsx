import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useMemo, useRef, useState } from 'react'

const SwitchTheme = () => {
  const [theme, setTheme] = useState(() => {
    const storedTheme =
      typeof window !== 'undefined' && localStorage.getItem('theme')
    return storedTheme ? storedTheme : 'wireframe'
  })

  if (typeof window !== 'undefined') {
    window.localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'wireframe' ? 'dark' : 'wireframe'))
    document.documentElement.setAttribute('data-theme', theme)
  }

  return (
    <button className="btn btn-circle" onClick={toggleTheme}>
      {theme === 'wireframe' ? (
        <FontAwesomeIcon icon={faSun} />
      ) : (
        <FontAwesomeIcon icon={faMoon} />
      )}
    </button>
  )
}

export default SwitchTheme
