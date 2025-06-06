// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'
import { resendAdapter } from '@payloadcms/email-resend'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import Products from './collections/Products'
import Categories from './collections/Categories'
import Orders from './collections/Orders'
import { Pages } from './collections/Pages'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  email: resendAdapter({
    defaultFromAddress: 'noreply@kraftedkorner.com',
    defaultFromName: 'Krafted Korner',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Products, Categories, Orders, Pages],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    s3Storage({
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || '',
      },
      collections: {
        media: true,
      },
    }),
  ],
})
