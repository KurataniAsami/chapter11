import { prisma } from '../../../../_libs/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { PostType } from '@/_types/post'

export type Category = {
  id: number
  name: string
}

export type PostShowResponse = {
  post: PostType
}

export const GET = async (
  _request: NextRequest,   
  { params }: { params: Promise<{ id: string }> },  
) => {
  const { id } = await params   
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

if(!post) {
  return NextResponse.json(
    { message: '記事が見つかりません'},
    { status: 404},
  )
}

  return NextResponse.json({ post }, { status: 200})
} catch (error) {
  if(error instanceof Error)
    return NextResponse.json({ message: error.message}, { status: 400})
}
}

// 記事更新API
export type UpdatePostRequestBody =  {
  title: string
  content: string
  categories: { id: number }[]
  thumbnailImageKey : string
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params

  const { title, content, categories, thumbnailImageKey }: UpdatePostRequestBody = await request.json()

  try {
    const post = await prisma.post.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        content,
        thumbnailImageKey,
      },
    })

    await prisma.postCategory.deleteMany({
      where: {
        postId: parseInt(id),
      },
    })

    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          postId: post.id,
          categoryId: category.id,
        }
      })
    }

    return NextResponse.json({ message: '成功しました' }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400})
  }
}

// 記事削除API
export const DELETE = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string}> },
) => {
  const { id } = await params

  try {
    await prisma.post.delete({
      where: {
        id: parseInt(id),
      },
    })

    return NextResponse.json({ message: '成功' }, { status: 200 })
  } catch (error) {
    if(error instanceof Error)
      return NextResponse.json({ message: error.message}, { status: 400 })
  }
}

