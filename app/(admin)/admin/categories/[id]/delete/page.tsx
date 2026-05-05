'use client'
import { supabase } from '@/_libs/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function DeletePostPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const handleDelete = async () => {

    const { data: { session }} = await supabase.auth.getSession()
    const token = session?.access_token

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await res.json()
      console.log(data)

      router.push('/admin/categories')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">カテゴリー削除</h1>
      <p>このカテゴリーを削除しますか？</p>
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
      >
        削除する
      </button>
    </div>
  )
}

