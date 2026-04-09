import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import './globals.css'
import { cn } from '@/lib/utils'
import { Raleway } from 'next/font/google'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { AdminBar } from '@/components/AdminBar'
import { Header } from '@/globals/Header/header'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { draftMode } from 'next/headers'

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-raleway'
})
/* const { SITE_NAME, TWITTER_CREATOR, TWITTER_SITE } = process.env
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000'
const twitterCreator = TWITTER_CREATOR ? ensureStartsWith(TWITTER_CREATOR, '@') : undefined
const twitterSite = TWITTER_SITE ? ensureStartsWith(TWITTER_SITE, 'https://') : undefined
 */
/* export const metadata = {
  metadataBase: new URL(baseUrl),
  robots: {
    follow: true,
    index: true,
  },
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  ...(twitterCreator &&
    twitterSite && {
      twitter: {
        card: 'summary_large_image',
        creator: twitterCreator,
        site: twitterSite,
      },
    }),
} */


export default async function RootLayout({ children }: React.PropsWithChildren) {
  const { isEnabled: draft } = await draftMode()
  return (
    <html
      // className={[GeistSans.variable, GeistMono.variable].filter(Boolean).join(' ')}
      className={raleway.variable}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <meta httpEquiv='Accept-CH' content='Sec-CH-Width, Sec-CH-DPR, Sec-Ch-Viewport-Width, Width, DPR, Viewport-Width, Save-Data, ECT, RTT, Downlink' />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          {/* <AdminBar /> */}
          {draft && <LivePreviewListener />}
          <div className="relative flex min-h-dvh flex-col px-0 md:px-4">
            <Header />
            <main
              className={cn(
                "relative mx-auto md:max-w-4xl grow w-full",
                // X Borders
                "before:absolute before:-inset-y-14 before:-left-px before:w-px before:bg-border",
                "after:absolute after:-inset-y-14 after:-right-px after:w-px after:bg-border"
              )}
            >
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
