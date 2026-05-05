// 新規作成ページ
'use client'
import { useState} from "react";
import { useRouter } from 'next/navigation'
import { CreatePostRequestBody } from "@/api/admin/posts/route";
import { PostForm, PostFormData } from '../posts/_components/PostForm'
import { Category } from "@/api/admin/posts/[id]/route"
import { supabase } from "@/_libs/supabase";

export default function CreatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('https://placehold.jp/800x400.png',)
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)

  // 作成処理
  const onSubmit = async (data: PostFormData) => {

    setLoading(false)

    const body: CreatePostRequestBody = {
      title: data.title,
      content: data.content,
      thumbnailImageKey: data.thumbnailUrl,
      categories,
    }

    const { data: { session }} = await supabase.auth.getSession()
    const token = session?.access_token

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`  
        },
        body: JSON.stringify(body)
      })
        router.push('/admin/')
      } catch(err) {
        setError(err instanceof Error ? err.message : 'ポストを作成できませんでした')
      } finally {
        setLoading(false)
      }
  }

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">新規記事投稿</h1>
      
      <PostForm
        // title={title}
        // setTitle={setTitle}
        // content={content}
        // setContent={setContent}
        // thumbnailUrl={thumbnailUrl}
        // setThumbnailUrl={setThumbnailUrl}
        // categories={categories}
        // setCategories={setCategories}
        onSubmit={onSubmit}
        disabled={loading}
        mode="new"
      />
    </div>
  )
}
