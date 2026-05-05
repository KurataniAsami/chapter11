// 記事詳細ページ
'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image'
import { PostType } from '@/_types/post'
import { PostShowResponse } from '../../../api/posts/[id]/route';
import Link from 'next/link';

const PostDetail = () => {
  const [post, setPost] = useState<PostShowResponse["post"] | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState(false);

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`)
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
        <div>{post.createdAt.toLocaleString()}</div>
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
    </div>
  )
}

export default PostDetail


