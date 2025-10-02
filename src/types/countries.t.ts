import z from 'zod';

export const CountrySchema = z.object({
	id: z.string(),
	name: z.string(),
	code: z.string(),
	flag: z.string(),
	active: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type Country = z.infer<typeof CountrySchema>;
