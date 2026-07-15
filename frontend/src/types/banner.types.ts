export interface IBannerSubsection {
  title?: string
  content?: string
}

export interface IBanner {
  _id: string
  title: string
  shortDescription?: string
  content?: string
  image: string
  link?: string
  isActive: boolean
  startDate?: string
  endDate?: string
  order: number
  createdAt: string
  updatedAt: string
  // Structured Article fields
  author?: string
  categoryName?: string
  sapo?: string
  contentSections?: IBannerSubsection[]
  highlightsTitle?: string
  highlights?: string[]
  quote?: string
  quoteAuthor?: string
}
