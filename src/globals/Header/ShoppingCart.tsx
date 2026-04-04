'use client'
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useCart } from "@payloadcms/plugin-ecommerce/client/react"
import { ShoppingBasket } from "lucide-react"
import React, { useMemo } from "react"
import { DeleteItemButton } from "./DeleteItemButton"
import Link from "next/link"
import Image from "next/image"
import { Price } from "@/collections/Products/components/Price"
import { EditItemQuantityButton } from "./EditItemQuantityButton"
import { Product } from "@/payload-types"

export function ShoppingCart() {
  const { cart } = useCart()

  const totalQuantity = useMemo(() => {
    if (!cart || !cart.items || !cart.items.length) {
      return undefined
    }
    return cart.items.reduce((quantity, item) => (item.quantity || 0) + quantity, 0)
  }, [cart])

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button className='cursor-pointer' size={totalQuantity ? 'sm' : 'icon-sm'}>
          <ShoppingBasket />
          {totalQuantity ? (
            <>
              <span>{totalQuantity}</span>
              <span>items</span>
              {/* <span>•</span> */}
            </>
          ) : null}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>My Cart</DrawerTitle>
          <DrawerDescription>Manage your cart here, add items to view the total.</DrawerDescription>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4">
          {!cart || cart?.items?.length === 0 ? (
            <div className="text-center flex flex-col items-center gap-2">
              <ShoppingBasket className="h-16" />
              <p className="text-center text-2xl font-bold">Your cart is empty.</p>
            </div>
          ) : (
            <div className="grow flex px-4">
              <div className="flex flex-col justify-between w-full">
                <ul className="grow overflow-auto py-4">
                  {cart?.items?.map((item, i) => {
                    const product = item.product
                    const variant = item.variant

                    if (typeof product !== 'object' || !item || !product || !product.slug) {
                      return <React.Fragment key={i} />
                    }

                    const metaImage =
                      product.meta?.image && typeof product.meta?.image === 'object'
                        ? product.meta.image
                        : undefined

                    const firstGalleryImage =
                      typeof product.gallery?.[0]?.image === 'object'
                        ? product.gallery?.[0]?.image
                        : undefined

                    let image = firstGalleryImage || metaImage
                    let price = product.priceInUSD

                    const isVariant = Boolean(variant) && typeof variant === 'object'

                    if (isVariant) {
                      price = variant?.priceInUSD

                      const imageVariant = product.gallery?.find((item: any) => {
                        if (!item.variantOption) return false
                        const variantOptionID =
                          typeof item.variantOption === 'object'
                            ? item.variantOption.id
                            : item.variantOption

                        const hasMatch = variant?.options?.some((option: any) => {
                          if (typeof option === 'object') return option.id === variantOptionID
                          else return option === variantOptionID
                        })

                        return hasMatch
                      })

                      if (imageVariant && typeof imageVariant.image === 'object') {
                        image = imageVariant.image
                      }
                    }

                    return (
                      <li className="flex w-full flex-col" key={i}>
                        <div className="relative flex w-full flex-row justify-between px-1 py-4">
                          <div className="absolute z-40 -mt-2 ml-[55px]">
                            <DeleteItemButton item={item} />
                          </div>
                          <Link
                            className="z-30 flex flex-row space-x-4"
                            href={`/products/${(item.product as Product)?.slug}`}
                          >
                            <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                              {image?.url && (
                                <Image
                                  alt={image?.alt || product?.title || ''}
                                  className="h-full w-full object-cover"
                                  height={94}
                                  src={image.url}
                                  width={94}
                                />
                              )}
                            </div>

                            <div className="flex flex-1 flex-col text-base">
                              <span className="leading-tight">{product?.title}</span>
                              {isVariant && variant ? (
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 capitalize">
                                  {variant.options
                                    ?.map((option: any) => {
                                      if (typeof option === 'object') return option.label
                                      return null
                                    })
                                    .join(', ')}
                                </p>
                              ) : null}
                            </div>
                          </Link>
                          <div className="flex h-16 flex-col justify-between">
                            {typeof price === 'number' && (
                              <Price
                                amount={price}
                                className="flex justify-end space-y-2 text-right text-sm"
                              />
                            )}
                            <div className="ml-auto flex h-9 flex-row items-center rounded-lg border">
                              <EditItemQuantityButton item={item} type="minus" />
                              <p className="w-6 text-center">
                                <span className="w-full text-sm">{item.quantity}</span>
                              </p>
                              <EditItemQuantityButton item={item} type="plus" />
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>


              </div>
            </div>
          )}
        </div>
        <DrawerFooter>
          <div className="px-4">
            <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
              {typeof cart?.subtotal === 'number' && (
                <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                  <p>Total</p>
                  <Price
                    amount={cart?.subtotal}
                    className="text-right text-base text-black dark:text-white"
                  />
                </div>
              )}

              <Button render={<Link className="w-full" href="/checkout" />} nativeButton={false}>
                Proceed to Checkout
              </Button>
            </div>
          </div>
          {/* <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose> */}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
