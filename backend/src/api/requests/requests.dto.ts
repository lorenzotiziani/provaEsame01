import * as z from 'zod'

export const idRequirements = z.object({
	params: z.object({
		id: z.coerce
			.number()
			.int('ID deve essere un numero intero')
			.positive('ID deve essere positivo')
	})
})

export const requestRequirements = z.object({
	body: z.object({
		dataInizio: z.coerce.date(),
		dataFine: z.coerce.date(),
		categoriaId: z.coerce.number().int().positive(),
		motivazione: z.string().nonempty(),
	})
}).refine(
	(data) => data.body.dataInizio < data.body.dataFine,
	{
		message: "La data di inizio deve essere precedente alla data di fine",
		path: ["body", "dataFine"]
	}
);


export type requestDTO=z.infer<typeof requestRequirements>['body']