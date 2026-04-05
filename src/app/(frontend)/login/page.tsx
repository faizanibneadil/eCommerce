import { DecoratedBox } from "@/components/DecoratedBox";
import { LoginForm } from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import { headers as getHeaders } from "next/headers";
import config from '@payload-config'
import { getPayload } from "payload";
import { redirect } from "next/navigation";

export default async function Login() {
    const headers = await getHeaders()
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers })

    if (Boolean(user) === true) {
        redirect('/')
    }

    return (
        <DecoratedBox>
            <div className="flex items-center justify-center py-40">
                <div className="w-full max-w-sm animate-in space-y-8">
                    <div className="flex flex-col space-y-1">
                        <h1 className="font-bold text-2xl tracking-wide">Join Now!</h1>
                        <p className="text-base text-muted-foreground">
                            Login or create your Noore account.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <LoginForm />
                        {/* <AuthDivider>OR</AuthDivider> */}
                        <Button className="w-full" type="button" variant="outline">
                            <GoogleIcon data-icon="inline-start" />
                            Continue with Google
                        </Button>
                        {/* <div className="grid grid-cols-2 gap-2 space-y-2"> */}
                        {/* <Button className="w-full" type="button" variant="outline">
                                <GithubIcon data-icon="inline-start" />
                                GitHub
                            </Button> */}
                        {/* </div> */}
                    </div>
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
                </div>
            </div>
        </DecoratedBox>
    )
}


const GoogleIcon = (props: React.ComponentProps<"svg">) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <g>
            <path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
        </g>
    </svg>
);