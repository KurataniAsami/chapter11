// カテゴリー 一覧API
import { supabase } from '@/_libs/supabase'
import { prisma } from '../../../_libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

export type CategryIndexResponse = {
  categories: {
    id: number
    name: string
    createdAt: Date
    updatedAt: Date
  }[]
}

export const GET = async (request: NextRequest) => {

  const token = request.headers.get('Authorization') ?? ''

  const { error } = await supabase.auth.getUser(token)
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    })

    return NextResponse.json({ categories }, { status: 200 })
  } catch(error) {
    if(error instanceof Error)
      return NextResponse.json({ message: error.message}, { status: 400 })
  }
}

// カテゴリー新規作成
export type CreateCategoryRequestBody = {
  name: string
}

export type CreateCategoryResponse = {
  id: number
}

export const POST = async (request: Request) => {

  const token = request.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)
  try {
    const body = await request.json()

    const { name }: CreateCategoryRequestBody = body

    const data = await prisma.category.create({
      data: {
        name,
      }
    })

    return NextResponse.json<CreateCategoryResponse>({
      id: data.id
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message}, { status: 400 })
    }
  }
}
