// カテゴリー詳細ページ（管理者）
'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image'
import Link from 'next/link';
import { CategoryShowResponse } from '@/api/admin/categories/[id]/route';

const CategoryDetail = () => {
  const [category, setCategory] = useState<CategoryShowResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState(false);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await fetch(`/api/admin/categories/${id}`)
        const data = await response.json()
        setCategory(data.category)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (id) getCategory()
  }, [id])

  if (loading) return <p>loading</p>
  if (error || !category)  return <p>記事が見つかりません</p>
  
  return (
    <div className='w-[800px] mx-auto'>

      <Link
        href={`/admin/categories/${category.category.id}/edit`}
        className="bg-black text-white px-4 py-2 rounded mr-3"
      >
        編集
      </Link>
      <div className='mt-3'>
        <Link href={'./'}>
          一覧に戻る
        </Link>
      </div>
    </div>
  )
}

export default CategoryDetail

