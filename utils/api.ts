export const submitRequest = async (url: string, input: string) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: input }),
    })

    const data = await response.json()
    if (response.status !== 200) {
      throw (
        data.error ||
        new Error(`Request failed with status ${response.status}`)
      )
    }
    return data.result
}