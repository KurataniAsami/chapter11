import { useSupabaseSession } from '@/_hooks/useSupabaseSession'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

//  ログインしていない時はログイン画面へリダイレクトさせるコンポーネント
export const useRouteGuard = () => {
  const router = useRouter()
  const { session, isLoading } = useSupabaseSession()
  
  useEffect(() => {
    if (isLoading) return // sessionの取得中は何もしない

    const fetcher = async () => {
      if (session === null) {
        router.replace('/sign_in')
      }
    }

    fetcher()
  }, [router, isLoading, session])
}