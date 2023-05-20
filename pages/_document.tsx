import { Html, Head, Main, NextScript } from 'next/document'
import { useState } from 'react'

export default function Document() {
  const getTheme = () => {
    const storedTheme =
      typeof window !== 'undefined' && localStorage.getItem('theme')
    return storedTheme ? storedTheme : 'wireframe'
  }

  const theme = getTheme()

  return (
    <Html lang="en" data-theme={theme}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
