'use client';
import { Button } from "@/components/ui/button"
import { Drawer } from '@base-ui/react/drawer';
import { ScrollArea } from '@base-ui/react/scroll-area';
import { useCart } from "@payloadcms/plugin-ecommerce/client/react"
import { ShoppingBasket, X } from "lucide-react"
import React, { useMemo, useState } from "react"
import { DeleteItemButton } from "./DeleteItemButton"
import Link from "next/link"
import Image from "next/image"
import { Price } from "@/collections/Products/components/Price"
import { EditItemQuantityButton } from "./EditItemQuantityButton"
import { Product } from "@/payload-types"

export function ShoppingCart() {
  const { cart } = useCart()
  const [open, setOpen] = useState(false)

  const totalQuantity = useMemo(() => {
    if (!cart || !cart.items || !cart.items.length) {
      return undefined
    }
    return cart.items.reduce((quantity, item) => (item.quantity || 0) + quantity, 0)
  }, [cart])

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger render={
        <Button onClick={() => setOpen(true)} className='cursor-pointer rounded-full' size={totalQuantity ? 'lg' : 'icon-lg'}>
          <ShoppingBasket />
          {totalQuantity ? (
            <>
              <span>{totalQuantity}</span>
              <span className="hidden md:block">items</span>
            </>
          ) : null}
        </Button>
      } />

      <Drawer.Portal>
        <Drawer.Backdrop className="z-10 fixed inset-0 min-h-dvh bg-black/10 opacity-(--backdrop-opacity) transition-opacity duration-600 ease-(--ease-out-fast) backdrop-blur-xs data-starting-style:opacity-0 data-ending-style:opacity-0" />

        <Drawer.Viewport className="group fixed inset-0 z-12 flex flex-col md:flex-row md:justify-end">
          <ScrollArea.Root
            style={{ position: undefined }}
            className="box-border h-full w-full overscroll-contain transition-transform duration-600 ease-(--ease-out-fast) 
                       group-data-starting-style:translate-y-full md:group-data-starting-style:translate-y-0 md:group-data-starting-style:translate-x-full 
                       group-data-ending-style:pointer-events-none"
          >
            <ScrollArea.Viewport className="box-border h-full overscroll-contain touch-auto">
              <ScrollArea.Content className="flex min-h-full items-end justify-center pt-8 md:min-h-dvh md:items-stretch md:justify-end md:p-0">
                <Drawer.Popup className="group box-border w-full max-w-2xl outline-none transition-transform duration-800 ease-(--ease-out-fast) 
                                       md:h-full md:max-w-md md:flex
                                       data-ending-style:translate-y-full md:data-ending-style:translate-y-0 md:data-ending-style:translate-x-full">

                  <div className="relative flex flex-col rounded-t-2xl bg-gray-50 text-gray-900 shadow-xl outline-1 outline-gray-200 
                                md:flex-1 md:h-full md:rounded-none md:rounded-l-xl md:min-h-dvh">

                    {/* Header */}
                    <div className="px-6 pt-4 pb-2">
                      <div className="mb-3 grid grid-cols-[1fr_auto_1fr] items-center md:flex md:justify-between md:mb-6">
                        <div aria-hidden className="h-9 w-9 md:hidden" />
                        <div className="h-1 w-12 justify-self-center rounded-full bg-gray-300 md:hidden" />
                        <Drawer.Title className="hidden md:block m-0 text-xl font-semibold tracking-tight">My Cart</Drawer.Title>
                        <Drawer.Close className="flex h-9 w-9 items-center justify-center justify-self-end rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                          <X className="size-4" />
                        </Drawer.Close>
                      </div>
                      <div className="md:hidden">
                        <Drawer.Title className="m-0 mb-1 text-lg font-medium">My Cart</Drawer.Title>
                        <Drawer.Description className="m-0 mb-4 text-sm text-gray-500">
                          Manage your cart here.
                        </Drawer.Description>
                      </div>
                    </div>

                    {/* Original Logic Section */}
                    <div className="flex-1 overflow-y-auto px-6 no-scrollbar">
                      {!cart || cart?.items?.length === 0 ? (
                        <div className="text-center flex flex-col items-center gap-2 py-20">
                          <ShoppingBasket className="h-16 w-16 text-gray-300" />
                          <p className="text-xl font-bold">Your cart is empty.</p>
                        </div>
                      ) : (
                        <ul className="grow overflow-auto py-4 divide-y divide-gray-100">
                          {cart?.items?.map((item, i) => {
                            const product = item.product
                            const variant = item.variant

                            if (typeof product !== 'object' || !item || !product || !product.slug) {
                              return <React.Fragment key={i} />
                            }

                            // Aapki original image aur price logic start
                            const metaImage = product.meta?.image && typeof product.meta?.image === 'object' ? product.meta.image : undefined
                            const firstGalleryImage = typeof product.gallery?.[0]?.image === 'object' ? product.gallery?.[0]?.image : undefined
                            let image = firstGalleryImage || metaImage
                            let price = product.priceInUSD
                            const isVariant = Boolean(variant) && typeof variant === 'object'

                            if (isVariant) {
                              price = (variant as any)?.priceInUSD
                              const imageVariant = product.gallery?.find((item: any) => {
                                if (!item.variantOption) return false
                                const variantOptionID = typeof item.variantOption === 'object' ? item.variantOption.id : item.variantOption
                                const hasMatch = (variant as any)?.options?.some((option: any) => {
                                  if (typeof option === 'object') return option.id === variantOptionID
                                  else return option === variantOptionID
                                })
                                return hasMatch
                              })
                              if (imageVariant && typeof imageVariant.image === 'object') {
                                image = imageVariant.image
                              }
                            }
                            // Original logic end

                            return (
                              <li className="flex w-full flex-col" key={i}>
                                <div className="relative flex w-full flex-row justify-between py-4">
                                  <div className="absolute z-40 -mt-2 ml-[55px]">
                                    <DeleteItemButton item={item} />
                                  </div>
                                  <Link className="z-30 flex flex-row space-x-4" href={`/products/${(item.product as Product)?.slug}`}>
                                    <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300">
                                      {image?.url && (
                                        <Image alt={image?.alt || product?.title || ''} className="h-full w-full object-cover" height={94} src={image.url} width={94} />
                                      )}
                                    </div>
                                    <div className="flex flex-1 flex-col text-base">
                                      <span className="leading-tight line-clamp-2">{product?.title}</span>
                                      {isVariant && variant ? (
                                        <p className="text-sm text-neutral-500 capitalize">
                                          {(variant as any).options?.map((option: any) => typeof option === 'object' ? option.label : null).filter(Boolean).join(', ')}
                                        </p>
                                      ) : null}
                                    </div>
                                  </Link>
                                  <div className="flex h-16 flex-col justify-between">
                                    {typeof price === 'number' && <Price amount={price} className="flex justify-end text-right text-sm" />}
                                    <div className="ml-auto flex h-9 flex-row items-center rounded-lg border">
                                      <EditItemQuantityButton item={item} type="minus" />
                                      <p className="w-6 text-center"><span className="w-full text-sm">{item.quantity}</span></p>
                                      <EditItemQuantityButton item={item} type="plus" />
                                    </div>
                                  </div>
                                </div>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </div>

                    {/* Footer Section */}
                    {cart?.items && cart.items.length > 0 && (
                      <div className="sticky bottom-0 z-50 border-t border-gray-200 px-6 py-6 bg-white md:rounded-bl-xl">
                        {typeof cart?.subtotal === 'number' && (
                          <div className="flex justify-between text-base font-semibold mb-4">
                            <p>Total</p>
                            <Price amount={cart?.subtotal} />
                          </div>
                        )}
                        <Button
                          className="w-full h-12 text-lg"
                          render={<Link href="/checkout" onClick={() => setOpen(false)} />}
                          nativeButton={false}
                        >
                          Proceed to Checkout
                        </Button>
                      </div>
                    )}
                  </div>
                </Drawer.Popup>
              </ScrollArea.Content>
            </ScrollArea.Viewport>
          </ScrollArea.Root>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  )
}