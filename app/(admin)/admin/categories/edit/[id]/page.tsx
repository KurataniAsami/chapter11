// カテゴリー更新
'use client'

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { UpdateCategoryRequestBody } from "@/api/admin/categories/[id]/route"
import { CategoryForm } from '../../_components/CategoryForm'
import { supabase } from "@/_libs/supabase"

export default function EditCategoryPage() {
  const { id } = useParams<{ id : string}>()
  const router = useRouter()
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 既存カテゴリデータ取得
  useEffect(() => {
  const fetchCategory = async () => {

      const { data: { session }} = await supabase.auth.getSession()
      const token = session?.access_token

      try {
        const res = await fetch(`/api/admin/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })  
        const data = await res.json()   
        setCategory(data.name)  
      } catch (err) {
        setError(err instanceof Error ? err.message : "取得に失敗");
      } finally {
        setLoading(false);
      }
};
fetchCategory();
}, [id])

// 更新処理
const handleSubmit = async (e: { preventDefault: () => void }) => {
  e.preventDefault()

  const body: UpdateCategoryRequestBody = {
    name: category,
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
if (loading) return <p>loading...</p>

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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">カテゴリー編集</h1>

      <div className="flex">
        <CategoryForm
          category={category}
          setCategory={setCategory}
          loading={loading}
          onSubmit={handleSubmit}
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
