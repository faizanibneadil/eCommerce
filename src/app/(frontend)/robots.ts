import { getServerSideURL } from "@/utilities/getURL"

/* eslint-disable no-restricted-exports */
const baseUrl = getServerSideURL()

export default function robots() {
  return {
    host: baseUrl,
    rules: [
      {
        userAgent: '*',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
