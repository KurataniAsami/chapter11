// 共通コンポーネント（新規作成のコードと記事編集コードの重複部分をまとめた物）
'use client'
import { Category } from "@/api/admin/posts/[id]/route"
import { ChangeEvent, useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/_libs/supabase'
import Image from "next/image"
import { useForm } from "react-hook-form"

type CategoryProps = {
  // title: string
  // setTitle: (title: string) => void
  // content: string
  // setContent: (content: string) => void
  // thumbnailUrl: string
  // setThumbnailUrl: (thumbnailUrl: string) => void
  // categories: Category[]  // 選択されたカテゴリー一覧
  // setCategories: (categories: Category[]) => void
  initialData?: PostFormData
  onSubmit: (data: PostFormData) => void
  disabled?: boolean
  mode: 'new' | 'edit'
}

export type PostFormData = {
  title: string,
  thumbnailUrl: string  // registerにないが送信するから必要
  content: string
}

export const PostForm: React.FC<CategoryProps> = ({
  // title,
  // setTitle,
  // content,
  // setContent,
  // thumbnailUrl,
  // setThumbnailUrl,
  onSubmit,
  disabled,
  mode,
}) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormData>({
  });

  // 画像アップロード処理
  const [thumbnailImageKey, setThumbnailImageKey] = useState('')
  // アップロードした画像を表示する
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null,
  )

  const handleImageChange = async (
  event: ChangeEvent<HTMLInputElement>,
): Promise<void> => {
  if(!event.target.files || event.target.files.length == 0) {
    return
  }

  const file = event.target.files[0]  
  const filePath = `private/${uuidv4()}`  

  const { data, error } = await supabase.storage
    .from('post_thumbnail')   
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if(error) {
    alert(error.message)
    return
  } 

  setThumbnailImageKey(data.path)
}

  useEffect(() => {
    if(!thumbnailImageKey) return

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
      .from('post_thumbnail')
      .getPublicUrl(thumbnailImageKey)

      setThumbnailImageUrl(publicUrl)
    } 

    fetcher()
  },[thumbnailImageKey])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      <div>
        <label>タイトル</label>
        <input
          className="w-full border p-2"
          disabled={disabled}
          {...register("title")}
        />
      </div>

      <div>
        <label>内容</label>
        <textarea
          className="w-full border p-2 h-40"
          disabled={disabled}
          {...register("content")}
        />
      </div>

      <div>
        <label
          htmlFor="thumbnailImageKey"
          className="block text-sm font-medium text-gray-700"
        >
          サムネイルURL
        </label>
        <input
          type="file"
          id="thumbnailImageKey"
          // onChange={handleImageChange}
            accept="image/*"
            {...register("thumbnailUrl")}
        />
      </div>

      <div>
        <label>画像</label>
        <input
          className="w-full border p-2"
          disabled={disabled}
        />
      </div>

      {/* 画像プレビュー */}
      {thumbnailImageUrl && (
        <div className="mt-2">
          <Image
            src={thumbnailImageUrl}
            alt={"thumbnail"}
            width={400}
            height={400}
          />
        </div>
      )}
      
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {mode === 'new' ? '作成' : '更新'}
      </button>

    </form>
  )
}