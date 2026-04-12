'use client'

import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Address } from "@/payload-types"
import { useAuth } from "@/providers/Auth"
import { useAddresses, useCart, useCurrency, usePayments } from "@payloadcms/plugin-ecommerce/client/react"
import { AtSignIcon, UserCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"
import { AddressItem } from "../Addresses/AddressItem"
import { CreateAddressModal } from "../Addresses/CreateAddressModal"
import { AddressForm } from "../AddressForm"
import { DecoratedBox } from "../DecoratedBox"
import { LoginForm } from "../LoginForm"
import { Button } from "../ui/button"
import { Divider } from "../ui/divider"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import OrderConfirmationDrawer from "./OrderConfirmationDrawer"

export const CheckoutPage: React.FC = () => {
    const [error, setError] = React.useState<null | string>(null)
    const [email, setEmail] = React.useState<null | string>(null)
    const [paymentMethod, setPaymentMethod] = React.useState<string | null>(null)
    const [transactionStatus, setTransactionStatus] = React.useState<null | string>(null)
    const [shippingAddress, setShippingAddress] = React.useState<Partial<Address>>()
    const [billingAddress, setBillingAddress] = React.useState<Partial<Address>>()
    const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = React.useState(true)
    const { user } = useAuth()
    const { initiatePayment, confirmOrder } = usePayments()
    const { cart, clearCart } = useCart()
    const router = useRouter()
    const cartIsEmpty = !cart || !cart?.items || !cart?.items?.length
    const canGoToPayment = Boolean((email || user) && billingAddress && (billingAddressSameAsShipping || shippingAddress))

    React.useEffect(() => {
        return () => {
            setShippingAddress(undefined)
            setBillingAddress(undefined)
            setBillingAddressSameAsShipping(true)
            setEmail('')
        }
    }, [])

    const initiatePaymentIntent = React.useCallback(async (paymentID: string) => {
        try {
            setTransactionStatus('wait for initializing transaction ...')
            const paymentData = (await initiatePayment(paymentID, {
                additionalData: {
                    ...(email ? { customerEmail: email } : {}),
                    billingAddress,
                    shippingAddress: shippingAddress,
                },
            })) as Record<string, unknown>

            console.log('Payment Intent:', paymentData)
            setTransactionStatus('wait for order confirmation ...')
            const confirmResult = await confirmOrder('cod', {
                additionalData: {
                    orderID: paymentData.orderID,
                    customerEmail: email
                }
            })
            // await clearCart().then(() => router.replace('/'))
            console.log('Order confirmed:', (confirmResult as any)?.orderID)
        } catch (error) {
            setTransactionStatus(null)
            const errorData = error instanceof Error ? JSON.parse(error.message) : {}
            let errorMessage = 'An error occurred while initiating payment.'

            if (errorData?.cause?.code === 'OutOfStock') {
                errorMessage = 'One or more items in your cart are out of stock.'
            }

            setError(errorMessage)
            // toast.error(errorMessage)
        } finally {
            setTransactionStatus(null)
        }
    }, [billingAddress, billingAddressSameAsShipping, shippingAddress])

    if (cartIsEmpty) {
        return (
            <div className="w-full">
                <DecoratedBox>
                    <div className="flex flex-col items-center justify-center  px-4 py-2 md:px-6 md:py-4">
                        <p>Your cart is empty.</p>
                        <Link href="/">Continue shopping?</Link>
                    </div>
                </DecoratedBox>
            </div>
        )
    }

    return (
        <>
            <OrderConfirmationDrawer transactionStatus={transactionStatus} />
            <div className="w-full">
                <DecoratedBox>
                    <div className="flex items-center justify-center  px-4 py-2 md:px-6 md:py-4">
                        <div className="w-full max-w-sm animate-in space-y-8">
                            {Boolean(user) === false && (<GuestCheckoutForm
                                email={email}
                                setEmail={setEmail}
                                setPaymentMethod={setPaymentMethod}
                                setShippingAddress={setShippingAddress}
                                shippingAddress={shippingAddress!}
                                transactionStatus={transactionStatus}
                            />)}
                            {Boolean(user) === true && (<UserCheckoutForm
                                setPaymentMethod={setPaymentMethod}
                                setShippingAddress={setShippingAddress}
                                shippingAddress={shippingAddress!}
                                transactionStatus={transactionStatus}
                            />)}
                            {Boolean(shippingAddress) === true && Boolean(paymentMethod) === true && Boolean(paymentMethod) === true && (
                                <Button onClick={() => initiatePaymentIntent(paymentMethod!)} disabled={Boolean(transactionStatus)} className="w-full" type="button" variant="outline">
                                    {Boolean(user) === false && (
                                        <UserCircle data-icon="inline-start" />
                                    )}
                                    {Boolean(transactionStatus)
                                        ? `Processing (${transactionStatus})`
                                        : Boolean(user) === false ? 'Continue as Guest' : 'Continue'}
                                </Button>
                            )}
                            <TermsAndConditions />
                        </div>
                    </div>
                </DecoratedBox>
            </div>
        </>
    )
}


const GuestEmail: React.FC<{
    email: string | null,
    setEmail: React.Dispatch<React.SetStateAction<string | null>>,
    transactionStatus: string | null
}> = ({ email, setEmail, transactionStatus }) => {
    return (
        <Field>
            <InputGroup>
                <InputGroupInput
                    placeholder="your.email@example.com"
                    type="email"
                    disabled={Boolean(transactionStatus)}
                    value={email!}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <InputGroupAddon align="inline-start">
                    <AtSignIcon />
                </InputGroupAddon>
            </InputGroup>
        </Field>
    )
}

const AuthForm: React.FC = () => {
    return (
        <>
            <div className="flex flex-col space-y-1">
                <h1 className="font-bold text-2xl tracking-wide">Join Now!</h1>
                <p className="text-base text-muted-foreground">
                    Login or create your Noore account.
                </p>
            </div>
            <div className="space-y-4">
                <LoginForm />
            </div>
        </>
    )
}

const TermsAndConditions: React.FC = () => {
    return (
        <p className="text-muted-foreground text-sm">
            By clicking continue, you agree to our{" "}
            <a
                className="underline underline-offset-4 hover:text-primary"
                href="#"
            >
                Terms of Service
            </a>{" "}
            and{" "}
            <a
                className="underline underline-offset-4 hover:text-primary"
                href="#"
            >
                Privacy Policy
            </a>
            .
        </p>
    )
}

const GuestAddressForm: React.FC<{
    transactionStatus: string | null,
    shippingAddress: Partial<Address>,
    setShippingAddress: React.Dispatch<React.SetStateAction<Partial<Address> | undefined>>
}> = ({ setShippingAddress, shippingAddress, transactionStatus }) => {
    const { user } = useAuth()
    if (Boolean(shippingAddress) === false) {
        return (
            <AddressForm {...(Boolean(user) === false && {
                callback: (address) => setShippingAddress(address),
                skipSubmission: true,
            })} />
        )
    }
    return (
        <div className="[&>div]:px-0">
            <AddressItem
                address={shippingAddress!}
                actions={
                    <Button
                        variant={'outline'}
                        disabled={Boolean(transactionStatus)}
                        onClick={(e) => {
                            e.preventDefault()
                            setShippingAddress(undefined)
                        }}
                    >
                        Remove
                    </Button>
                }
            />
        </div>
    )
}

const PaymentMethodSelector: React.FC<{
    transactionStatus: string | null,
    setPaymentMethod: React.Dispatch<React.SetStateAction<string | null>>
}> = ({ setPaymentMethod, transactionStatus }) => {
    const { paymentMethods } = usePayments()
    return (
        <>
            <div className="flex flex-col space-y-1">
                <h1 className="font-bold text-2xl tracking-wide">Payments</h1>
                <p className="text-base text-muted-foreground">
                    Select your favorite payment method.
                </p>
            </div>
            <RadioGroup disabled={Boolean(transactionStatus)} onValueChange={setPaymentMethod} className="max-w-sm">
                {paymentMethods?.map(item => (
                    <FieldLabel key={item?.name} htmlFor="plus-plan">
                        <Field orientation="horizontal">
                            <FieldContent>
                                <FieldTitle>{item?.name?.toUpperCase()}</FieldTitle>
                                <FieldDescription>
                                    {item?.label}
                                </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value={item?.name} id="plus-plan" />
                        </Field>
                    </FieldLabel>
                ))}
            </RadioGroup>
        </>
    )
}

const GuestCheckoutForm: React.FC<{
    email: string | null,
    setEmail: React.Dispatch<React.SetStateAction<string | null>>,
    transactionStatus: string | null,
    shippingAddress: Partial<Address>,
    setShippingAddress: React.Dispatch<React.SetStateAction<Partial<Address> | undefined>>
    setPaymentMethod: React.Dispatch<React.SetStateAction<string | null>>
}> = ({ email, setEmail, setPaymentMethod, setShippingAddress, shippingAddress, transactionStatus }) => {
    return (
        <>
            <AuthForm />
            <Divider>OR</Divider>
            <div className="flex flex-col space-y-1">
                <h1 className="font-bold text-2xl tracking-wide">Guest!</h1>
                <p className="text-base text-muted-foreground">
                    Enter your Email and shipping address to checkout as guest
                </p>
            </div>
            <GuestEmail email={email} setEmail={setEmail} transactionStatus={transactionStatus} />
            <GuestAddressForm setShippingAddress={setShippingAddress} shippingAddress={shippingAddress} transactionStatus={transactionStatus} />
            <PaymentMethodSelector setPaymentMethod={setPaymentMethod} transactionStatus={transactionStatus} />
        </>
    )
}

const UserAddressForm: React.FC<{
    transactionStatus: string | null,
    shippingAddress: Partial<Address>,
    setShippingAddress: React.Dispatch<React.SetStateAction<Partial<Address> | undefined>>
}> = ({ shippingAddress, transactionStatus, setShippingAddress }) => {
    const { addresses, isLoading } = useAddresses()

    React.useEffect(() => {
        if (!shippingAddress) {
            if (Boolean(addresses.length)) {
                setShippingAddress(addresses.at(0))
            }
        }
    }, [addresses])

    if (isLoading) {
        return <div>Loading addresses ...</div>
    }

    if (!Boolean(addresses.length)) {
        return <CreateAddressModal />
    }

    return (
        <div className="flex flex-col gap-2">
            {addresses?.map(address => (
                <div key={address.id} className="[&>div]:px-0">
                    <AddressItem
                        address={address}
                        afterActions={
                            <Button
                                variant={shippingAddress?.id === address.id ? 'default' : 'outline'}
                                className='cursor-pointer'
                                disabled={Boolean(transactionStatus)}
                                onClick={(e) => {
                                    e.preventDefault()
                                    setShippingAddress(address)
                                }}
                            >
                                {shippingAddress?.id === address.id ? 'Selected' : 'Select'}
                            </Button>
                        }
                    />
                </div>
            ))}
            <CreateAddressModal />
        </div>
    )
}

const UserCheckoutForm: React.FC<{
    transactionStatus: string | null,
    shippingAddress: Partial<Address>,
    setShippingAddress: React.Dispatch<React.SetStateAction<Partial<Address> | undefined>>
    setPaymentMethod: React.Dispatch<React.SetStateAction<string | null>>
}> = ({ setPaymentMethod, setShippingAddress, shippingAddress, transactionStatus }) => {
    return (
        <>
            <UserAddressForm setShippingAddress={setShippingAddress} shippingAddress={shippingAddress} transactionStatus={transactionStatus} />
            <PaymentMethodSelector setPaymentMethod={setPaymentMethod} transactionStatus={transactionStatus} />
        </>
    )
}