import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { adminOnly } from '@/access/adminOnly'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  admin: {
    group: 'Content',
  },
  folders: true,
  slug: 'media',
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    formatOptions: {
      format: 'webp',
    },
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 150,
        height: 150, // Square thumbnails for cart/lists
      },
      {
        name: 'card', // Product listing grid ke liye best hai
        width: 500,
        height: 500,
      },
      {
        name: 'medium', // Tablet screens aur PDP main image
        width: 900,
      },
      {
        name: 'large', // Desktop PDP main view aur Zoom
        width: 1400,
      },
      {
        name: 'og', // SEO aur Social sharing ke liye
        width: 1200,
        height: 630,
        crop: 'centre',
      },
    ],
  },
}