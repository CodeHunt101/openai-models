export const submitRequest = async (
  url: string,
  input: string,
  user?: string | null
) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt: input, user }),
  })

  const data = await response.json()
  if (response.status !== 200) {
    throw (
      data.error || new Error(`Request failed with status ${response.status}`)
    )
  }
  return data.result
}

export const deleteMessages = async (
  endpoint: 'chat' | 'visual-analysis',
  user?: string | null
) => {
  if (!user) return
  try {
    await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deleteMessages: true, user: user as string }),
    })
  } catch (error) {
    console.error(error)
    alert(error)
  }
}
