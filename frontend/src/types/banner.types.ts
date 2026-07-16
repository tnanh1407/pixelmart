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
  isActive: boolean
  startDate?: string
  endDate?: string
  order: number
  durationInDays?: string
  createdAt: string
  updatedAt: string
  author?: string
  categoryName?: string
  sapo?: string
  contentSections?: IBannerSubsection[]
  highlightsTitle?: string
  highlights?: string[]
  quote?: string
  quoteAuthor?: string
}
