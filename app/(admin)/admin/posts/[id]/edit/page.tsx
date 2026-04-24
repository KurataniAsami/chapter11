'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PostType } from '@/_types/post'
import { UpdatePostRequestBody } from '@/api/admin/posts/[id]/route'
import { PostForm } from '../../_components/PostForm'
import { Category } from "@/api/admin/posts/[id]/route"
import { supabase } from '@/_libs/supabase'

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  //  フォームの情報を取得
  useEffect(() => {
    const fetchPost = async () => {

      const { data: { session }} = await supabase.auth.getSession()
      const token = session?.access_token

      try {
        const res = await fetch(`/api/admin/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await res.json()
        const post = data.post
        setContent(post.content)
      } catch(err) {
        setError(err instanceof Error ? err.message: '更新に失敗');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id])

  //  更新処理
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    const body: UpdatePostRequestBody = {
      title,
      content,
      thumbnailImageKey: thumbnailUrl,
      categories: categories.map((category) => ({
        id: Number(category.id),
      })),
    }

    const { data: { session }} = await supabase.auth.getSession()
    const token = session?.access_token

    try {
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body),
    })
    router.push('/admin/')
  } catch (err) {
    setError(err instanceof Error ? err.message: '更新に失敗')
  }
  }

  if (loading) return <p>loading...</p>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">記事編集</h1>

      <PostForm
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailUrl={thumbnailUrl}
        setThumbnailUrl={setThumbnailUrl}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleSubmit}
        disabled={loading}
        mode="edit"
      />
    </div>
  )
}

