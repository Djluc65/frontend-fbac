export type NewsCategory = 'news' | 'event' | 'success' | 'report'
export type NewsStatus = 'draft' | 'published'

export interface NewsAuthor {
  _id?: string
  firstName: string
  lastName: string
}

export interface NewsItem {
  _id: string
  title: string
  content: string
  excerpt: string
  image: string
  author?: NewsAuthor | string
  category: NewsCategory
  isFeatured: boolean
  status: NewsStatus
  views: number
  createdAt: string
  updatedAt: string
}

export interface NewsPayload {
  title: string
  content: string
  excerpt: string
  image: string
  category: NewsCategory
  isFeatured: boolean
  status: NewsStatus
}
