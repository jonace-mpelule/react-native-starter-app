import z from 'zod';

export const LoginZodSchema = z.object({
	phoneNumber: z.string({ message: 'Enter your phone number' }),
	password: z.string({
        message: 'Enter a password',
    }).min(6, { message: 'Password must be at least 6 characters long' }),
});

export type LoginShema = {
	email?: string;
	phoneNumber?: string;
	password: string;
};

export const RegisterZodSchema = z.object({
	firstName: z.string({ message: 'Enter your first name' }).min(2),
	lastName: z.string({ message: 'Enter your last name' }).min(2),
	email: z.email({ message: 'Enter a valid email address' }).optional(),
	role: z.string().optional(),
	phoneNumber: z.string({ message: 'Enter your phone number' }),
	password: z
		.string({ message: 'Enter a password' })
		.min(6, { message: 'Password must be at least 6 characters long' }),
});

export type RegisterSchema = z.infer<typeof RegisterZodSchema>;

export type LogoutSchema = {
	refreshToken: string;
};
