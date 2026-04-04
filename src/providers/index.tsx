import { AuthProvider } from '@/providers/Auth'
import { EcommerceProvider } from '@payloadcms/plugin-ecommerce/client/react'
// import { stripeAdapterClient } from '@payloadcms/plugin-ecommerce/payments/stripe'
import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { SonnerProvider } from '@/providers/Sonner'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <NuqsAdapter>
      <ThemeProvider>
        <AuthProvider>
          <HeaderThemeProvider>
            <SonnerProvider />
            <EcommerceProvider
              enableVariants={true}
              currenciesConfig={{
                defaultCurrency: 'PKR',
                supportedCurrencies: [
                  {
                    code: 'PKR',
                    label: 'Pakistani Rupees',
                    symbol: '₨',
                    decimals: 2
                  }
                ]
              }}
              api={{
                cartsFetchQuery: {
                  depth: 2,
                  populate: {
                    products: {
                      slug: true,
                      title: true,
                      gallery: true,
                      inventory: true,
                    },
                    variants: {
                      title: true,
                      inventory: true,
                    },
                  },
                },
              }}
              paymentMethods={[
                // stripeAdapterClient({
                //   publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
                // }),
              ]}
            >
              {children}
            </EcommerceProvider>
          </HeaderThemeProvider>
        </AuthProvider>
      </ThemeProvider>
    </NuqsAdapter>
  )
}
