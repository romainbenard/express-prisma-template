import { z } from 'zod'

export const createUserValidation = z.object({
  email: z.string(),
  name: z.string(),
})

export type CreateUser = z.infer<typeof createUserValidation>

export const updateUserValidation = createUserValidation.partial()

export type UpdateUser = z.infer<typeof updateUserValidation>
