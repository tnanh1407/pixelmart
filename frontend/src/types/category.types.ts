export interface ICategory {
  _id: string
  name: string
  slug: string
  parentId?: string | null
  description?: string
  image?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
