import { z } from 'zod'

export const clientSchema = z.object({
  clientId: z.string(),
  userId: z.string(),
  clientName: z.string().min(1, { message: 'Client name is required' }),
  email: z.union([z.string().email(), z.literal(''), z.undefined()]),
  phone: z.union([z.string().min(10), z.literal(''), z.undefined()]),
  address: z.string().optional(),
  VATNumber: z.string().optional(),
  currencyPreference: z.string().optional().default('USD'),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const createClientSchema = clientSchema.omit({
  clientId: true,
  userId: true,
  createdAt: true,
  updatedAt: true
})

export const clientArraySchema = z.array(clientSchema)

export const updateClientSchema = clientSchema.omit({
  clientId: true,
  userId: true,
  createdAt: true,
  updatedAt: true
})

export type Client = z.infer<typeof clientSchema>

export type CreateClient = z.infer<typeof createClientSchema>

export type UpdateClient = z.infer<typeof updateClientSchema>
