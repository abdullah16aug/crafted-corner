export interface PageSection {
  title: string
  content: any // This will be the rich text content from Payload
}

export interface ContactInfo {
  address: string
  phone: string
  email: string
  businessHours: Array<{
    day: string
    hours: string
  }>
}

export interface Page {
  id: string
  title: string
  type: 'about' | 'contact' | 'terms' | 'privacy-policy' | 'refund-policy' | 'data-removal'
  content: {
    sections: PageSection[]
  }
  contactInfo?: ContactInfo
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string
  }
}
