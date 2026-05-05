// 一覧（管理者）
'use client'
import Link from 'next/link';
import { PostsIndexResponse } from '@/api/posts/route'
// import { useSupabaseSession } from '@/_hooks/useSupabaseSession';
// import useSWR from 'swr'
import { fetcher } from '@/_libs/fetcher';  // useFetchを介して使われているのでここでは未使用
import { useFetch } from '@/_hooks/useFetch';

// const fetcher = async ([url, token]: [string, string]
// ):Promise<PostsIndexResponse> => {
//   const res = await fetch(url, {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//   })
//   return res.json()
// } 

export default function Home() {
  // const { token } = useSupabaseSession()

  // SWR
  const { data, error, isLoading } = useFetch<PostsIndexResponse>(`/api/admin/posts`)
  console.log(data)
  
  if (isLoading) return <div>Loading...</div>
  if(error) return <p>記事の取得に失敗しました</p>
  if(!data || !data.posts) {
    return <p>記事が見つかりません</p>
  }
  
  return (
    <div>
      <div className='flex justify-between'>
        <h1 className="text-2xl font-bold mb-6">記事一覧</h1>
        <Link href={'/admin/new'}
          className="bg-blue-500 text-white p-2"
        >
          新規記事作成
        </Link>
      </div>
    <ul>
      {data.posts.map((post) => (
        <li key={post.id}
          className='border border-gray-300 max-w-3xl mx-auto my-5'
        >
          <Link
            href={`/admin/posts/${post.id}`}
          >
            <div className='flex justify-between mx-4 my-4'>
              <div>{post.createdAt.toString()}</div>
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
    </div>
  );
}