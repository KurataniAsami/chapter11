export type Category = {
  id: number
  name: string
}

export type PostType = {
  id: number
  title: string
  content: string
  thumbnailImageKey: string
  createdAt: string
  updatedAt: string
  postCategories: {
    category: Category
  }[]
}

// 記事一覧取得APIの型
export type PostsIndexResponse = {
  posts: PostType[]
}

