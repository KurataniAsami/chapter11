// カテゴリー詳細ページ（管理者）
'use client'
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CategoryShowResponse } from '@/api/admin/categories/[id]/route';
import useSWR from 'swr';
import { useSupabaseSession } from '@/_hooks/useSupabaseSession';

const fetcher = async ([url, token]: [string, string]
):Promise<CategoryShowResponse> => {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  return res.json()
}

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { token } = useSupabaseSession()
  
  const { data, error, isLoading} = useSWR<CategoryShowResponse>(token ? [`/api/admin/categories/${id}`]: null,
    fetcher
  )

  if(isLoading || !data) return <div>Loading...</div>
  if (error)  return <p>カテゴリーの取得に失敗しました</p>
  
  return (
    <div className='w-[800px] mx-auto'>

      <Link
        href={`/admin/categories/${data.category.id}/edit`}
        className="bg-black text-white px-4 py-2 rounded mr-3"
      >
        編集
      </Link>
      <div className='mt-3'>
        <Link href={'./'}>
          一覧に戻る
        </Link>
      </div>
    </div>
  )
}

export default CategoryDetail

