'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CategryIndexResponse } from '@/api/admin/categories/route'
import { supabase } from '@/_libs/supabase'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategryIndexResponse["categories"]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {

      const { data: { session }} = await supabase.auth.getSession()
      const token = session?.access_token
      
      try {
        const res = await fetch('/api/admin/categories', {
          headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`  
        },
        })
        const data = await res.json()
        setCategories(data.categories)
      } catch (err) {
        setError(err instanceof Error ? err.message : "サーバーからの応答がありませんでした");
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      <div className='flex justify-between'>
        <h1 className="text-2xl font-bold mb-6">カテゴリー一覧</h1>
        <Link href={'/admin/categories/new'}
          className="bg-blue-500 text-white p-2"
        >
          カテゴリー作成
        </Link>
      </div>
      <div>
        <div className='flex flex-col'>
          {categories.map((category) => (
            <Link
              href={`/admin/categories/edit/${category.id}`}
              key={category.id} className="hover:bg-gray-200"
            >
              <span>{category.name}</span>    
            </Link>
        ))}
        </div>
      </div>
    </div>
  )
}

