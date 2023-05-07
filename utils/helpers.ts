export const generatePrompt = (prompt: string) => {
  console.log({ prompt })
  const capitalizedPrompt =
    prompt[0].toUpperCase() + prompt.slice(1).toLowerCase()
  return capitalizedPrompt
}
