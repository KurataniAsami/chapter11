'use client'
import Link from 'next/link';
import { PostType } from './_types/post'
import useSWR from 'swr'

type Posts = {
  posts: PostType[]
}

const fetcher = (url:string) => fetch(url).then(res => res.json())

export default function Home() {
  const { data, error, isLoading } = useSWR<Posts>('/api/posts', fetcher)

  if (isLoading || !data) return <p>loading</p>
  if(error) return <p>記事の取得に失敗しました</p>
  if (data.posts.length === 0) return <p>記事が見つかりません</p>

  return (
    <ul>
      {data.posts.map((post) => (
        <li key={post.id}
          className='border border-gray-300 max-w-3xl mx-auto my-5'
        >
          <Link
            href={`/posts/${post.id}`}
          >
            <div className='flex justify-between mx-4 my-4'>
              <div>{post.createdAt}</div>
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
