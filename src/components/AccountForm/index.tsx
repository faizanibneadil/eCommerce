'use client'

import { useAuth } from "@/providers/Auth"
import { AtSignIcon, Fingerprint, UserCircleIcon, UserIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { FormError } from "../FormError"
import { Button } from "../ui/button"
import { Field, FieldDescription } from "../ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { User } from "@/payload-types"

type FormData = {
    email: string
    name: User['name']
    password: string
    passwordConfirm: string
}

export const AccountForm: React.FC = () => {
    const { setUser, user } = useAuth()
    const [changePassword, setChangePassword] = useState(false)
    const router = useRouter()

    const {
        formState: { errors, isLoading, isSubmitting, isDirty },
        handleSubmit,
        register,
        reset,
        watch,
    } = useForm<FormData>()

    const onSubmit = useCallback(async (data: FormData) => {
        if (user) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`, {
                // Make sure to include cookies with fetch
                body: JSON.stringify(data),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'PATCH',
            })

            if (response.ok) {
                const json = await response.json()
                setUser(json.doc)
                toast.success('Successfully updated account.')
                setChangePassword(false)
                reset({
                    name: json.doc.name,
                    email: json.doc.email,
                    password: '',
                    passwordConfirm: '',
                })
            } else {
                toast.error('There was a problem updating your account.')
            }
        }
    }, [user, setUser, reset])

    useEffect(() => {
        if (user === null) {
            router.push(`/login`)
        }

        // Once user is loaded, reset form to have default values
        if (user) {
            reset({
                name: user.name,
                email: user.email,
                password: '',
                passwordConfirm: '',
            })
        }
    }, [user, router, reset, changePassword])

    return (
        <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
            <Field>
                <InputGroup>
                    <InputGroupInput
                        placeholder="your.email@example.com"
                        type="email"
                        {...register('email', { required: 'Please provide an email.' })}
                    />
                    <InputGroupAddon align="inline-start">
                        <AtSignIcon />
                    </InputGroupAddon>
                </InputGroup>
                {errors.email && (<FieldDescription>
                    <FormError as="span" message={errors.email.message} />
                </FieldDescription>)}
            </Field>
            <Field>
                <InputGroup>
                    <InputGroupInput
                        placeholder="name"
                        type="text"
                        {...register('name', { required: 'Please provide a name.' })}
                    />
                    <InputGroupAddon align="inline-start">
                        <UserCircleIcon />
                    </InputGroupAddon>
                </InputGroup>
                {errors.name && (<FieldDescription>
                    <FormError as="span" message={errors.name.message} />
                </FieldDescription>)}
            </Field>
            <Field>
                <InputGroup>
                    <InputGroupInput
                        placeholder="Enter your password"
                        type="password"
                        {...register('password')}
                    />
                    <InputGroupAddon align="inline-start">
                        <Fingerprint />
                    </InputGroupAddon>
                </InputGroup>
                {errors.password && (<FieldDescription>
                    <FormError as="span" message={errors.password.message} />
                </FieldDescription>)}
            </Field>
            <Field>
                <InputGroup>
                    <InputGroupInput
                        placeholder="Confirm your password"
                        type="password"
                        {...register('passwordConfirm', {
                            // required: 'Please confirm your new password.',
                            validate: (value) => value === watch('password', '') || 'The passwords do not match',
                        })}
                    />
                    <InputGroupAddon align="inline-start">
                        <Fingerprint />
                    </InputGroupAddon>
                </InputGroup>
                {errors.passwordConfirm && (<FieldDescription>
                    <FormError as="span" message={errors.passwordConfirm.message} />
                </FieldDescription>)}
            </Field>

            <Button className="w-full cursor-pointer" size="lg" type="submit">
                {(isLoading || isSubmitting) ? 'Processing' : 'Continue'}
            </Button>
        </form>
    )
}