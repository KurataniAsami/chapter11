// カテゴリー作成
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreateCategoryRequestBody } from '@/api/admin/categories/route'
import { CategoryForm } from '../_components/CategoryForm'
import { supabase } from '@/_libs/supabase'

export default function CreateCategoryPage() {
  const router = useRouter()
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 作成処理
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setLoading(true)

    const body: CreateCategoryRequestBody = {
      name: category
    }

    const { data: { session }} = await supabase.auth.getSession()
    const token = session?.access_token

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body),
      })

      router.push('/admin/categories')
      } catch (err) {
        setError(err instanceof Error ? err.message : "サーバーからの応答がありませんでした");
      } finally {
        setLoading(false)
      }
    } 
 
  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded">
      <h1 className="text-2xl font-bold mb-4">カテゴリー作成</h1>
      <CategoryForm
        category={category}
        setCategory={setCategory}
        loading={loading}
        onSubmit={handleSubmit}
        mode="edit"
      />
    </div>
  )
}