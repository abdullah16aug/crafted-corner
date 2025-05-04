import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'
import Link from 'next/link'

import config from '@/payload.config'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div className="pt-8 pb-16 flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Crafted Corner</h1>
        <p className="text-gray-600 text-center mb-8">
          Welcome to your beautiful crafted corner website!
        </p>
        <div className="flex justify-center">
          <Link
            href="/admin"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150"
          >
            Go to Admin Panel
          </Link>
        </div>
      </div>
    </div>
  )
}
