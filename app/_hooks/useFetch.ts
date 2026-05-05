import { useSupabaseSession } from '@/_hooks/useSupabaseSession';
import useSWR from 'swr'
import { fetcher } from '@/_libs/fetcher';   // トークンが取得できたら使用

export const useFetch = <T>(url: string) => {
  const { token } = useSupabaseSession()

  const { data, error, isLoading } = useSWR<T>(token ? [url, token]: null,
    fetcher
  )

  return { data, error, isLoading }

}
