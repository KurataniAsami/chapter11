'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PostShowResponse } from '@/api/posts/[id]/route';

export default function Home() {
  const [posts, setPosts] = useState<PostShowResponse["post"][]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getAllPosts = async () => {
      const res = await fetch('/api/posts')
      const data = await res.json()
      setPosts(data.posts)
      setLoading(false)
    }

    getAllPosts()
  }, [])

  if (loading) return <p>loading</p>
  if (posts.length === 0) return <p>記事が見つかりません</p>

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}
          className='border border-gray-300 max-w-3xl mx-auto my-5'
        >
          <Link
            href={`/posts/${post.id}`}
          >
            <div className='flex justify-between mx-4 my-4'>
              <div>{post.createdAt.toLocaleString()}</div>
              {post.postCategories.map((postCategory) => (
                <span key={postCategory.category.id}>{postCategory.category.name}</span>
              ))}
            </div>

            <div>
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                className='line-clamp-2 mx-4 mb-3'
              />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
