import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import { redisKVAdapter } from '@payloadcms/kv-redis'

import {
  BoldFeature,
  EXPERIMENTAL_TableFeature,
  IndentFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { TextField, buildConfig, databaseKVAdapter } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from '@/collections/Categories'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { Users } from '@/collections/Users'
import { Footer } from '@/globals/Footer'
import { Header } from '@/globals/Header'
import { Settings } from '@/globals/Settings'
import { plugins } from './plugins'
import { ProductsBlock } from './blocks/ProductsBlock'
import { CategoriesBlock } from './blocks/CategoriesBlock'
import { CarouselBlock } from './blocks/CarouselBlock'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  hooks: {
    afterError: []
  },
  kv: databaseKVAdapter(),
  admin: {
    user: Users.slug,
    components: {
      graphics: {
        Icon: '@/graphics/Icon/index.tsx#Icon',
        Logo: '@/graphics/Logo/index.tsx#Logo'
      }
    }
  },
  folders: {
    // debug: true,
    slug: 'folders',
    browseByFolder: true
  },
  collections: [Users, Pages, Categories, Media],
  globals: [Header, Footer, Settings],
  blocks: [ProductsBlock, CategoriesBlock, CarouselBlock],
  cors: [process.env.NEXT_PUBLIC_SERVER_URL!].filter(Boolean),
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL!].filter(Boolean),
  db: postgresAdapter({
    blocksAsJSON: true,
    pool: {
      connectionString: process.env.DATABASE_URI!
    },
    readReplicas: [
      process.env.READ_REPLICA_1!,
      process.env.READ_REPLICA_2!,
      process.env.READ_REPLICA_3!
    ]
    // client: {
    //   url: process.env.SQL_LIGHT_URI || '',
    // },
  }),
  editor: lexicalEditor({
    features: () => {
      return [
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        OrderedListFeature(),
        UnorderedListFeature(),
        LinkFeature({
          enabledCollections: ['pages'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') {
                return false
              }
              return true
            })

            const linkTypeField: TextField = {
              name: 'url',
              type: 'text',
              admin: {
                condition: ({ linkType }) => linkType !== 'internal',
              },
              label: ({ t }) => t('fields:enterURL'),
              required: true,
            }

            return [...defaultFieldsWithoutUrl, linkTypeField]
          },
        }),
        IndentFeature(),
        EXPERIMENTAL_TableFeature(),
      ]
    },
  }),
  //email: nodemailerAdapter(),
  endpoints: [],
  plugins,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Sharp is now an optional dependency -
  // if you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  sharp,
})