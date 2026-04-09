'use client';
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { Drawer } from '@base-ui/react/drawer'
import { ScrollArea } from '@base-ui/react/scroll-area'
import { AddressForm } from '@/components/AddressForm'
import { Address } from '@/payload-types'
import { DefaultDocumentIDType } from 'payload'
import { X } from 'lucide-react'

type Props = {
  addressID?: DefaultDocumentIDType
  initialData?: Partial<Omit<Address, 'country'>> & { country?: string }
  buttonText?: string
  modalTitle?: string
  callback?: (address: Partial<Address>) => void
  skipSubmission?: boolean
  disabled?: boolean
}

export const CreateAddressModal: React.FC<Props> = ({
  addressID,
  initialData,
  buttonText = 'Add a new address',
  modalTitle = 'Add a new address',
  callback,
  skipSubmission,
  disabled,
}) => {
  const [open, setOpen] = useState(false)

  const handleCallback = (data: Partial<Address>) => {
    setOpen(false)
    if (callback) {
      callback(data)
    }
  }

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger
        // nativeButton={false}
        disabled={disabled}
        render={<Button onClick={() => setOpen(true)} variant='outline' />}
      >
        {buttonText}
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Backdrop className="z-10 fixed inset-0 min-h-dvh bg-black/10 opacity-(--backdrop-opacity) transition-opacity duration-600 ease-(--ease-out-fast) backdrop-blur-xs data-starting-style:opacity-0 data-ending-style:opacity-0" />

        {/* Viewport: Hamesha bottom par align rahega */}
        <Drawer.Viewport className="group fixed inset-0 z-12 flex flex-col items-center justify-end">
          <ScrollArea.Root
            style={{ position: undefined }}
            className="box-border w-full max-w-2xl overscroll-contain transition-transform duration-600 ease-(--ease-out-fast) 
                       group-data-starting-style:translate-y-full 
                       group-data-ending-style:pointer-events-none"
          >
            <ScrollArea.Viewport className="box-border overscroll-contain touch-auto max-h-[90dvh]">
              <ScrollArea.Content className="flex min-h-full items-end justify-center pt-8">
                <Drawer.Popup className="group box-border w-full outline-none transition-transform duration-800 ease-(--ease-out-fast) 
                                       data-ending-style:translate-y-full">

                  <div className="relative flex flex-col rounded-t-2xl bg-gray-50 text-gray-900 shadow-xl outline-1 outline-gray-200">

                    {/* Header with Drag Handle */}
                    <div className="px-6 pt-4 pb-2">
                      <div className="mb-3 grid grid-cols-[1fr_auto_1fr] items-center">
                        <div aria-hidden className="h-9 w-9" />
                        <div className="h-1 w-12 justify-self-center rounded-full bg-gray-300" />
                        <Drawer.Close className="flex h-9 w-9 items-center justify-center justify-self-end rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                          <X className="size-4" />
                        </Drawer.Close>
                      </div>
                      <Drawer.Title className="m-0 mb-1 text-lg font-semibold">{modalTitle}</Drawer.Title>
                      <Drawer.Description className="m-0 mb-4 text-sm text-gray-500">
                        This address will be connected to your account.
                      </Drawer.Description>
                    </div>

                    {/* Form Content Area */}
                    <div className="px-6 pb-8 overflow-y-auto no-scrollbar">
                      <AddressForm
                        addressID={addressID}
                        initialData={initialData}
                        callback={handleCallback}
                        skipSubmission={skipSubmission}
                      />
                    </div>

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