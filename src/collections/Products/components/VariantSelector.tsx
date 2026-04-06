'use client'

import { Button } from '@/components/ui/button'
import type { Product, Variant } from '@/payload-types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useQueryStates, parseAsString } from 'nuqs'
import React from 'react'

export function VariantSelector({ product }: { product: Product }) {
  const pathname = usePathname()
  const variants = product.variants?.docs as Variant[]
  const variantTypes = product.variantTypes
  const hasVariants = Boolean(product.enableVariants && variants?.length && variantTypes?.length)

  // 1. Saaray dynamic variant types ko query states mein define karein
  // Hum variant names ko keys bana rahe hain
  const querySchema = React.useMemo(() => {
    const schema: Record<string, any> = {
      variant: parseAsString,
      image: parseAsString,
    }
    variantTypes?.forEach((type) => {
      if (type && typeof type === 'object') {
        schema[type.name] = parseAsString
      }
    })
    return schema
  }, [variantTypes])

  const [query, setQuery] = useQueryStates(querySchema, {
    shallow: true,
    scroll: false
  })

  if (!hasVariants) {
    return null
  }

  return variantTypes?.map((type) => {
    if (!type || typeof type !== 'object') {
      return null
    }

    const options = type.options?.docs
    if (!options || !Array.isArray(options) || !options.length) return null

    return (
      <dl className="py-4" key={type.id}>
        <dt className="text-sm font-medium">{type.label}</dt>
        <dd className="flex flex-wrap gap-px">
          {options.map((option) => {
            if (!option || typeof option === 'number') return null

            const optionID = String(option.id)
            const optionKey = type.name

            // 2. Naya state calculate karein (prev state ko maintain rakhte hue)
            const newQueryState = {
              ...query,
              [optionKey]: optionID,
              variant: null, // Reset variant until we find the new match
              image: null,
            }

            // Available values for matching logic
            const currentOptions = Object.entries(newQueryState)
              .filter(([key, val]) => val && key !== 'variant' && key !== 'image')
              .map(([_, val]) => val)

            let isAvailableForSale = true
            let matchingVariantId = ''

            // 3. Variant Matching Logic
            if (variants) {
              const matchingVariant = variants.find((variant) => {
                if (typeof variant !== 'object' || !variant.options) return false
                return variant.options.every((vOpt) => {
                  const id = typeof vOpt === 'object' ? vOpt.id : vOpt
                  return currentOptions.includes(String(id))
                })
              })

              if (matchingVariant) {
                matchingVariantId = String(matchingVariant.id)
                isAvailableForSale = (matchingVariant.inventory ?? 0) > 0
              } else {
                isAvailableForSale = false // Is combination ka koi variant hi nahi hai
              }
            }

            const isActive = query[optionKey] === optionID

            return (
              <Button
                key={option.id}
                variant={isActive ? 'secondary' : 'outline'}
                className="rounded-none"
                size="sm"
                disabled={!isAvailableForSale}
                onClick={() => {
                  // Nuqs se state update karein
                  setQuery({
                    ...newQueryState,
                    variant: matchingVariantId || null,
                  })
                }}
              >
                {option.label}
              </Button>
            )
          })}
        </dd>
      </dl>
    )
  })
}