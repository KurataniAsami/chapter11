'use client'

import Link from 'next/link'
import { CategryIndexResponse } from '@/api/admin/categories/route'
import { useSupabaseSession } from '@/_hooks/useSupabaseSession'
import useSWR from 'swr'

const fetcher = async ([url, token]: [string, string]
):Promise<CategryIndexResponse> => {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  return res.json()
}

export default function CategoriesPage() {
  const { token } = useSupabaseSession()

  const { data, error, isLoading } = useSWR<CategryIndexResponse>(token ? [`/api/admin/categories`, token]: null,
    fetcher
  )

  if(isLoading || !data) return <div>Loading</div>
  if(error) return <p>カテゴリーの取得に失敗しました</p>

  return (
    <div className="max-w-4xl mx-auto">
      <div className='flex justify-between'>
        <h1 className="text-2xl font-bold mb-6">カテゴリー一覧</h1>
        <Link href={'/admin/categories/new'}
          className="bg-blue-500 text-white p-2"
        >
          カテゴリー作成
        </Link>
      </div>
      <div>
        <div className='flex flex-col'>
          {data.categories.map((category) => (
            <Link
              href={`/admin/categories/edit/${category.id}`}
              key={category.id} className="hover:bg-gray-200"
            >
              <span>{category.name}</span>    
            </Link>
        ))}
        </div>
      </div>
    </div>
  )
}

