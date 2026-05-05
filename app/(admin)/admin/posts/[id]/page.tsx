// 記事詳細ページ（管理者）
'use client'
import { useParams } from 'next/navigation';
import Image from 'next/image'
// import { PostType } from '@/_types/post'  // バックエンドの型を使用しているので未使用
import { PostShowResponse } from '../../../../api/admin/posts/[id]/route';
import Link from 'next/link';
import { useFetch } from '@/_hooks/useFetch';

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useFetch<PostShowResponse>(`/api/admin/posts/${id}`)

  if (isLoading || !data) return <p>loading</p>
  if (error)  return <p>記事の取得に失敗しました</p>
  if(!data.post) {
    return <p>記事が見つかりません</p>
  }
  
  return (
    <div className='w-[800px] mx-auto'>
      {data.post.thumbnailImageKey && (
        <Image
          src={data.post.thumbnailImageKey}
          width={800}
          height={400}
          alt={data.post.title}
        />
      )}

      <div className='flex justify-between mx-5 items-center my-3'>
        <div>{data.post.createdAt}</div>
        <div className='border-2 border-blue-500 rounded px-2 py-1 text-blue-500 inline-block'>
          {data.post.postCategories.map((postCategory) => (
            <span key={postCategory.category.id}>
              {postCategory.category.name}
            </span>
          ))}
        </div>
      </div>
      <h2  className='text-2xl mb-3 mx-4'>
        {data.post.title}
      </h2>
      <div dangerouslySetInnerHTML={{ __html: data.post.content }} 
        className='mx-4 mb-20'
      />

      <div>
        {data.post.postCategories.map((postCategory) => (
          <span key={postCategory.category.id}>
            <>{postCategory.category.name}</>
          </span>
        ))}
      </div>

      <Link
        href={`/admin/posts/${data.post.id}/edit`}
        className="bg-black text-white px-4 py-2 rounded mr-3"
      >
        編集
      </Link>
      <Link
        href={`/admin/posts/${data.post.id}/delete`}
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


