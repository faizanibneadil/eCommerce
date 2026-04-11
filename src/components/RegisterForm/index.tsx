'use client'
import { useAuth } from "@/providers/Auth"
import { AtSignIcon, Fingerprint } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { useForm } from 'react-hook-form'
import { FormError } from "../FormError"
import { Button } from "../ui/button"
import { Field, FieldDescription } from "../ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"

type FormData = {
    email: string
    password: string
    passwordConfirm: string
}

export const RegisterForm: React.FC = () => {
    const { login } = useAuth()
    const router = useRouter()
    const [error, setError] = useState<null | string>(null)

    const {
        formState: { errors, isLoading, isSubmitting },
        handleSubmit,
        register,
        watch,
    } = useForm<FormData>()

    const onSubmit = useCallback(async (data: FormData) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })

        if (!response.ok) {
            const message = response.statusText || 'There was an error creating the account.'
            setError(message)
            return
        }

        try {
            await login(data)
            router.replace('/')
        } catch (_) {
            setError('There was an error with the credentials provided. Please try again.')
        }
    }, [login, router])

    // useEffect(() => {
    //     if (status === 'loggedIn') {
    //         router.replace('/')
    //     }
    // }, [status])


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
            <Field>
                <InputGroup>
                    <InputGroupInput
                        placeholder="Confirm your password"
                        type="password"
                        {...register('passwordConfirm', {
                            required: 'Please confirm your password.',
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

            <Button disabled={isLoading || isSubmitting} className="w-full cursor-pointer" size="sm" type="submit">
                {(isLoading || isSubmitting) ? 'Processing' : 'Continue'}
            </Button>
            <Button nativeButton={false} render={<Link href='/login' />} variant='link' className="w-full cursor-pointer" size="sm" type="button">
                Login
            </Button>
        </form>
    )
}