'use client'

import { Address, Config } from "@/payload-types"
import { useAddresses, useCurrency } from "@payloadcms/plugin-ecommerce/client/react"
import { deepMergeSimple } from "payload/shared"
import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { Field, FieldDescription } from "../ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { FormError } from "../FormError"
import { Building, MapIcon, MapPin, MapPinned, PhoneCall, UserCircleIcon } from "lucide-react"
import { Button } from "../ui/button"
import { defaultCountries as supportedCountries } from '@payloadcms/plugin-ecommerce/client/react'

export const titles = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.', 'Mx.', 'Other']


type AddressFormValues = {
    title?: string | null
    firstName?: string | null
    lastName?: string | null
    company?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
    phone?: string | null
}
type Props = {
    addressID?: Config['db']['defaultIDType']
    initialData?: Omit<Address, 'country' | 'id' | 'updatedAt' | 'createdAt'> & { country?: string }
    callback?: (data: Partial<Address>) => void
    /**
     * If true, the form will not submit to the API.
     */
    skipSubmission?: boolean
}
export const AddressForm: React.FC<Props> = ({
    addressID,
    callback,
    initialData,
    skipSubmission,
}) => {

    const {
        register,
        handleSubmit,
        formState: { errors, isLoading, isSubmitting },
        setValue,
    } = useForm<AddressFormValues>({
        defaultValues: initialData,
    })

    const { createAddress, updateAddress } = useAddresses()

    const onSubmit = useCallback(async (data: AddressFormValues) => {
        const newData = deepMergeSimple(initialData || {}, data)

        if (!skipSubmission) {
            if (addressID) {
                await updateAddress(addressID, newData)
            } else {
                await createAddress(newData)
            }
        }

        if (callback) {
            callback(newData)
        }
    }, [initialData, skipSubmission, callback, addressID, updateAddress, createAddress])

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
                <div className="flex flex-col md:flex-row gap-1">
                    <Select
                        {...register('title')}
                        onValueChange={(value) => {
                            setValue('title', value, { shouldValidate: true })
                        }}
                        defaultValue={initialData?.title || ''}
                    >
                        <SelectTrigger id="title">
                            <SelectValue placeholder="Title" />
                        </SelectTrigger>
                        <SelectContent>
                            {titles.map((title) => (
                                <SelectItem key={title} value={title}>
                                    {title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.title && <FormError message={errors.title.message} />}
                    <Field>
                        <InputGroup>
                            <InputGroupInput
                                placeholder="First Name"
                                id="firstName"
                                autoComplete="given-name"
                                {...register('firstName', { required: 'First name is required.' })}
                            />
                            <InputGroupAddon align="inline-start">
                                <UserCircleIcon />
                            </InputGroupAddon>
                        </InputGroup>
                        {errors.firstName && (<FieldDescription>
                            <FormError as="span" message={errors.firstName.message} />
                        </FieldDescription>)}
                    </Field>
                    <Field>
                        <InputGroup>
                            <InputGroupInput
                                placeholder="Family Name"
                                autoComplete="family-name"
                                id="lastName"
                                {...register('lastName', { required: 'Last name is required.' })}
                            />
                            <InputGroupAddon align="inline-start">
                                <UserCircleIcon />
                            </InputGroupAddon>
                        </InputGroup>
                        {errors.lastName && (<FieldDescription>
                            <FormError as="span" message={errors.lastName.message} />
                        </FieldDescription>)}
                    </Field>
                </div>

                <Field>
                    <InputGroup>
                        <InputGroupInput placeholder="Phone/Contact Number" type="tel" id="phone" autoComplete="mobile tel" {...register('phone')} />
                        <InputGroupAddon align="inline-start">
                            <PhoneCall />
                        </InputGroupAddon>
                    </InputGroup>
                    {errors.phone && (<FieldDescription>
                        <FormError as="span" message={errors.phone.message} />
                    </FieldDescription>)}
                </Field>

                <Field>
                    <InputGroup>
                        <InputGroupInput placeholder="Company" id="company" autoComplete="organization" {...register('company')} />
                        <InputGroupAddon align="inline-start">
                            <Building />
                        </InputGroupAddon>
                    </InputGroup>
                    {errors.company && (<FieldDescription>
                        <FormError as="span" message={errors.company.message} />
                    </FieldDescription>)}
                </Field>

                <Field>
                    <InputGroup>
                        <InputGroupInput
                            placeholder="Address Line 1"
                            id="addressLine1"
                            autoComplete="address-line1"
                            {...register('addressLine1', { required: 'Address line 1 is required.' })}
                        />
                        <InputGroupAddon align="inline-start">
                            <MapPin />
                        </InputGroupAddon>
                    </InputGroup>
                    {errors.addressLine1 && (<FieldDescription>
                        <FormError as="span" message={errors.addressLine1.message} />
                    </FieldDescription>)}
                </Field>

                <Field>
                    <InputGroup>
                        <InputGroupInput placeholder="Address Line 2" id="addressLine2" autoComplete="address-line2" {...register('addressLine2')} />
                        <InputGroupAddon align="inline-start">
                            <MapPin />
                        </InputGroupAddon>
                    </InputGroup>
                    {errors.addressLine2 && (<FieldDescription>
                        <FormError as="span" message={errors.addressLine2.message} />
                    </FieldDescription>)}
                </Field>

                <Field>
                    <InputGroup>
                        <InputGroupInput
                            placeholder="City"
                            id="city"
                            autoComplete="address-level2"
                            {...register('city', { required: 'City is required.' })}
                        />
                        <InputGroupAddon align="inline-start">
                            <MapIcon />
                        </InputGroupAddon>
                    </InputGroup>
                    {errors.city && (<FieldDescription>
                        <FormError as="span" message={errors.city.message} />
                    </FieldDescription>)}
                </Field>

                <Field>
                    <InputGroup>
                        <InputGroupInput placeholder="State" id="state" autoComplete="address-level1" {...register('state')} />
                        <InputGroupAddon align="inline-start">
                            <MapIcon />
                        </InputGroupAddon>
                    </InputGroup>
                    {errors.state && (<FieldDescription>
                        <FormError as="span" message={errors.state.message} />
                    </FieldDescription>)}
                </Field>

                <Field>
                    <InputGroup>
                        <InputGroupInput
                            placeholder="Postal Code"
                            id="postalCode"
                            {...register('postalCode', { required: 'Postal code is required.' })} />
                        <InputGroupAddon align="inline-start">
                            <MapPinned />
                        </InputGroupAddon>
                    </InputGroup>
                    {errors.postalCode && (<FieldDescription>
                        <FormError as="span" message={errors.postalCode.message} />
                    </FieldDescription>)}
                </Field>


                <Select
                    {...register('country', {
                        required: 'Country is required.',
                    })}
                    onValueChange={(value) => {
                        setValue('country', value, { shouldValidate: true })
                    }}
                    required
                    defaultValue={initialData?.country || ''}
                >
                    <SelectTrigger id="country" className="w-full">
                        <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                        {[...supportedCountries, {
                            label: 'Pakistan',
                            value: 'PK'
                        }].map((country) => {
                            const value = typeof country === 'string' ? country : country.value
                            const label =
                                typeof country === 'string'
                                    ? country
                                    : typeof country.label === 'string'
                                        ? country.label
                                        : value

                            return (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
                {errors.country && <FormError message={errors.country.message} />}

            </div>

            <Button disabled={isLoading || isSubmitting} type="submit" className='w-full mt-2 cursor-pointer'>
                {Boolean(initialData)
                    ? (isLoading || isSubmitting) ? 'Updating ...' : 'Update'
                    : (isLoading || isSubmitting) ? 'Creating ....' : 'Create'}
            </Button>
        </form>
    )
}