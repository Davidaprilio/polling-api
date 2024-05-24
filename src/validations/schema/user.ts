import { z } from "zod";
import { Paginate } from "./paginate";

export const PasswordRule = z.string().min(8)
export const EmailRule = z.string().email()

export const SignIn = z.object({
    username: z.string().min(3),
    password: PasswordRule,
})

export const SignUp = z.object({
    username: z.string().min(3),
    name: z.string().min(3),
    email: EmailRule,
    password: PasswordRule,
})

export const ChangePassword = z.object({
    oldPassword: PasswordRule,
    newPassword: PasswordRule,
}).refine((val) => val.oldPassword !== val.newPassword , { 
    message: 'Old password cannot be the same as new password',
})

export const ForgotPassword = z.object({
    email: EmailRule,
})

export const ResetPassword = z.object({
    password: PasswordRule,
    token: z.string().min(20),
})

export const UserList = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
}).merge(Paginate)