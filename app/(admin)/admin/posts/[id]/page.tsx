// 記事詳細ページ（管理者）
'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image'
// import { PostType } from '@/_types/post'  // バックエンドの型を使用しているので未使用
import { PostShowResponse } from '../../../../api/admin/posts/[id]/route';
import Link from 'next/link';
import { supabase } from '@/_libs/supabase';

const PostDetail = () => {
  const [post, setPost] = useState<PostShowResponse["post"] | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState(false);

  useEffect(() => {
    const getPost = async () => {
      
      const { data: { session }} = await supabase.auth.getSession()
      const token = session?.access_token
      
      try {
        const response = await fetch(`/api/admin/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await response.json()

        setPost(data.post)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (id) getPost()
  }, [id])

  if (loading) return <p>loading</p>
  if (error || !post)  return <p>記事が見つかりません</p>
  
  return (
    <div className='w-[800px] mx-auto'>
      {post.thumbnailImageKey && (
        <Image
          src={post.thumbnailImageKey}
          width={800}
          height={400}
          alt={post.title}
        />
      )}

      <div className='flex justify-between mx-5 items-center my-3'>
        <div>{post.createdAt}</div>
        <div className='border-2 border-blue-500 rounded px-2 py-1 text-blue-500 inline-block'>
          {post.postCategories.map((postCategory) => (
            <span key={postCategory.category.id}>
              {postCategory.category.name}
            </span>
          ))}
        </div>
      </div>
      <h2  className='text-2xl mb-3 mx-4'>
        {post.title}
      </h2>
      <div dangerouslySetInnerHTML={{ __html: post.content }} 
        className='mx-4 mb-20'
      />

      <div>
        {post.postCategories.map((postCategory) => (
          <span key={postCategory.category.id}>
            <>{postCategory.category.name}</>
          </span>
        ))}
      </div>

      <Link
        href={`/admin/posts/${post.id}/edit`}
        className="bg-black text-white px-4 py-2 rounded mr-3"
      >
        編集
      </Link>
      <Link
        href={`/admin/posts/${post.id}/delete`}
        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
      >
        削除
      </Link>
      <div className='mt-3'>
        <Link href={'./'}>
          一覧に戻る
        </Link>
      </div>
    </div>
  )
}

export default PostDetail


