import { supabase } from '@/_libs/supabase'
import { prisma } from '../../../../_libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

// カテゴリー詳細API
export type CategoryShowResponse = {
  category: {
    id: number
    name: string
    createdAt: Date
    updatedAt: Date
  }
}

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const  token = request.headers.get('Authorization') ?? ''

  const { error } = await supabase.auth.getUser(token)

  if(error) {
    return NextResponse.json({ status: error.message }, { status: 401 })
  }

  const { id } = await params

  try {
    const category = await prisma.category.findUnique({
      where : {
        id: parseInt(id),
      },
    })

    if(!category) {
      return NextResponse.json(
        { message: 'カテゴリーが見つかりません'},
        { status: 404 }
      )
    }

    return NextResponse.json({ category }, { status: 200 })
  } catch (error) {
    if(error instanceof Error)
      return NextResponse.json({ message: error.message}, { status: 400 })
  }
}

// カテゴリー更新API
export type UpdateCategoryRequestBody = {
  name: string
}

export const PUT = async (
  request : NextRequest,
  { params }: { params: { id: string} },
) => {
  const token = request.headers.get('Authorization') ?? ''

  const { error } = await supabase.auth.getUser(token)
  const { id } = await params
  const { name }: UpdateCategoryRequestBody = await request.json()
  try {
    await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    })

    return NextResponse.json({ message: '成功'}, { status: 200 })
  } catch (error) {
    if(error instanceof Error)
      return NextResponse.json({ message: error.message}, { status: 400 })
  }
}

// カテゴリー削除API
export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string}>},
) => {
  const { id } = await params

  try {
    await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    })

    return NextResponse.json({ message: '削除できました'}, { status: 200 })
  } catch (error) {
    if(error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
