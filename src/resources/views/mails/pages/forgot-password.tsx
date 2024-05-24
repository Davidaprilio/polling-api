import { password } from "bun";

type ForgotPasswordPageProps = {
    name: string
    password: string
}
export default function ForgotPasswordPage({name, password}: ForgotPasswordPageProps) {
    return (
        <main>
            <h1>Forgot Password</h1>

            <p>
                Hello {name}, we received your request to reset your password. <br /> 
                and we sent you this email with your new password.
            </p>

            <fieldset>
                <legend>New Password</legend>

                <h3>{password}</h3>
            </fieldset>
            <br />

            <div>Regard Voting ID</div>
        </main>
    )
};
