'use client'
import { useAddresses } from "@payloadcms/plugin-ecommerce/client/react"
import { DecoratedBox } from "../DecoratedBox"
import { AddressItem } from "./AddressItem"
import { CreateAddressModal } from "./CreateAddressModal"

export const Addresses: React.FC = () => {
    const { addresses } = useAddresses()
    if (Boolean(addresses?.length) === false) {
        return (
            <DecoratedBox>
                <div className="flex items-center justify-center py-20">
                    <div className="w-full max-w-sm animate-in space-y-8">
                        <div className="flex flex-col space-y-1">
                            <h1 className="font-bold text-2xl tracking-wide">Addresses</h1>
                            <p className="text-base text-muted-foreground">
                                You have no Addresses
                            </p>
                        </div>
                    </div>
                    <CreateAddressModal />
                </div>
            </DecoratedBox>
        )
    }

    return (
        <>
            <DecoratedBox dividerBottom={false}>
                <div className="flex items-center justify-between px-4 py-2 md:px-6 md:py-4">
                    <div className="flex flex-col space-y-1">
                        <h1 className="font-bold text-2xl tracking-wide">My Addresses!</h1>
                        <p className="text-base text-muted-foreground">
                            You have {addresses?.length} addresses
                        </p>
                    </div>
                    <CreateAddressModal />
                </div>
            </DecoratedBox>
            {addresses?.map(address => (
                <DecoratedBox key={address.id}>
                    <AddressItem address={address} />
                </DecoratedBox>
            ))}
        </>
    )
}