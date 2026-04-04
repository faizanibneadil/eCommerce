'use client'
import { AtSignIcon, Fingerprint } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "../ui/input-group"
import { Button } from "../ui/button"
import Link from "next/link"
import { useForm } from 'react-hook-form'
import { useAuth } from "@/providers/Auth"
import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Field, FieldDescription } from "../ui/field"
import { FormError } from "../FormError"

type FormData = {
    email: string
    password: string
}

export const LoginForm: React.FC = () => {
    const { login, user, status } = useAuth()
    console.log({ status, user })
    const router = useRouter()
    const [error, setError] = useState<null | string>(null)

    const {
        formState: { errors, isLoading },
        handleSubmit,
        register,
    } = useForm<FormData>()

    const onSubmit = useCallback(async (data: FormData) => {
        try {
            await login(data)
            router.push('/')
        } catch (_) {
            setError('There was an error with the credentials provided. Please try again.')
        }
    }, [login, router])

    useEffect(() => {
        if (status === 'loggedIn') {
            router.replace('/')
        }
    }, [status])


    return (
        <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
            <Field>
                <InputGroup>
                    <InputGroupInput
                        placeholder="your.email@example.com"
                        type="email"
                        {...register('email', { required: 'Email is required.' })}
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
                        placeholder="Enter your password"
                        type="password"
                        {...register('password', { required: 'Please provide a password.' })}
                    />
                    <InputGroupAddon align="inline-start">
                        <Fingerprint />
                    </InputGroupAddon>
                </InputGroup>
                {errors.password && (<FieldDescription>
                    <FormError as="span" message={errors.password.message} />
                </FieldDescription>)}
            </Field>

            <Button className="w-full cursor-pointer" size="sm" type="submit">
                Continue
            </Button>
            <Button nativeButton={false} render={<Link href='/create-account' />} variant='link' className="w-full cursor-pointer" size="sm" type="button">
                Create an account
            </Button>
        </form>
    )
}