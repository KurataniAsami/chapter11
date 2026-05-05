'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { UpdatePostRequestBody } from '@/api/admin/posts/[id]/route'
import { PostForm, PostFormData } from '../../_components/PostForm'
import { Category } from "@/api/admin/posts/[id]/route"
import { supabase } from '@/_libs/supabase'
// import { useSupabaseSession } from '@/_hooks/useSupabaseSession';
// import useSWR from 'swr'
import { useFetch } from '@/_hooks/useFetch'

// const fetcher = async ([url, token]: [string, string]
// ):Promise<UpdatePostRequestBody> => {
//   const res = await fetch(url, {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     }
//   })
//   return res.json()
// }

type PostResponse = {
  post: {
    title: string
    content: string
    thumbnailImageKey: string
    categories: { id: number }[]
  }
}

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  // const { token } = useSupabaseSession()

  // カスタムフック使用のため
  // const { data, error: swrError, isLoading } = useswr<UpdatePostRequestBody>(token ? [`/api/admin/posts/${id}`, token]: null,
  //   fetcher
  // )
  // const { data, error: swrError, isLoading } = useFetch<UpdatePostRequestBody>(`/api/admin/posts/${id}`)
  const { data, error: swrError, isLoading } = useFetch<PostResponse>(`/api/admin/posts/${id}`)

  //  更新処理
  const onSubmit = async (data: PostFormData) => {

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
    swrError(err instanceof Error ? err.message: '更新に失敗')
  }
  }

  if(isLoading || !data) return <div>Loading...</div>
  if(swrError) return <p>カテゴリーの取得に失敗しました</p>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">記事編集</h1>

      <PostForm
      initialData={{
        title: data.post.title,
        content: data.post.content,
        thumbnailUrl: data.post.thumbnailImageKey ?? ''
      }}
        onSubmit={onSubmit}
        disabled={isLoading}
        mode="edit"
      />
    </div>
  )
}

