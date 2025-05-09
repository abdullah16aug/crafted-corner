import { getPayload } from 'payload'
import config from '@/payload.config'
import { Page } from './types'

const getPageContent = async (type: Page['type']): Promise<Page | null> => {
  try {
    console.log('Fetching page content for type:', type)
    const payload = await getPayload({ config })
    const response = await payload.find({
      collection: 'pages',
      where: {
        type: {
          equals: type,
        },
      },
    })
    console.log('Response:', response)
    return (response.docs[0] as Page) || null
  } catch (error) {
    console.error('Error fetching page content:', error)
    return null
  }
}

export { getPageContent }
