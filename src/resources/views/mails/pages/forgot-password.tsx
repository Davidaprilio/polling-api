import MainLayout from "@/resources/views/mails/layouts/MainLayout"

type ForgotPasswordPageProps = {
    name: string
    password: string
}

export default function ForgotPasswordMailPage({name, password}: ForgotPasswordPageProps) {
    return (
        <MainLayout>
            <h1 className='text-xl'>Forgot Password Request</h1>

            <p className='mt-5'>
                Hello {name}, we received your request to reset your password. and we sent you this email with your new password.
            </p>

            <div className='mt-5 max-w-screen-sm bg-blue-400 text-center mx-auto text-2xl p-6 w-fit rounded my-7'>
                <strong className='text-white font-bold'>{'password'}</strong>
            </div>

            <p>If you did not request a password reset, please ignore this email. Thanks You</p>
            <br />
        </MainLayout>
    )
};
