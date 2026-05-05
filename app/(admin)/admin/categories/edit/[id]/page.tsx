// カテゴリー更新
'use client'

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { UpdateCategoryRequestBody } from "@/api/admin/categories/[id]/route"
import { CategoryForm } from '../../_components/CategoryForm'
// useSupabaseSessionにSupabaseを使う処理をまとめたためimport不要
import { useSupabaseSession } from "@/_hooks/useSupabaseSession"
import useSWR from "swr"
import { useFetch } from "@/_hooks/useFetch"
import { CategoryFormData } from "../../_components/CategoryForm"


const fetcher = async ([url, token]: [string, string]
):Promise<UpdateCategoryRequestBody> => {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  return res.json()
}

export default function EditCategoryPage() {
  const { id } = useParams<{ id : string}>()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const { token } = useSupabaseSession()

  const { data, error: swrError, isLoading } = useSWR<UpdateCategoryRequestBody>(token ? [`/api/admin/categories/${id}`, token]: null,
    fetcher
  )

  
// 更新処理
const onSubmit = async (data: CategoryFormData) => {

  const body: UpdateCategoryRequestBody = {
    name: data.name,
  }

  try {
  await fetch(`/api/admin/categories/${id}`, {
    method: 'PUT',  // 上のURLにPUT（更新リクエスト）を送るという意味
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
    router.push('/admin/categories')
  } catch (err) {
      setError(err instanceof Error ? err.message : "更新に失敗");
    }
}

const handleDelete = async () => {
  try {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
    })

    router.push('/admin/categories')
  } catch (err) {
    setError(err instanceof Error ? err.message : '削除に失敗')
  }
}

  // if(isLoading || !data) return <div>Loading...</div>
  if(swrError) return <p>カテゴリーの取得に失敗しました</p>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">カテゴリー編集</h1>

      <div className="flex">
        <CategoryForm
          // category={category}
          // setCategory={setCategory}
          // loading={isLoading}
          // onSubmit={handleSubmit}
          onSubmit={onSubmit}
          mode="edit"
        />
        <Link
          href={`/admin/categories/${id}/delete`}
          className="bg-red-500 text-white px-4 py-2 rounded mt-4"
        >
          削除
        </Link>
      </div>
    </div>
  )
}
