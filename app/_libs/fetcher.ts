export const fetcher = async <T>([url, token]: [string, string]):Promise<T> => {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if(!res.ok) {
    throw new Error('データの取得に失敗しました')
  }

  return res.json()
} 

