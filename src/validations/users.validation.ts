import { z } from 'zod'

export const createUserValidation = z.object({
  email: z.string(),
  name: z.string(),
  password: z.string(),
})

export const updateUserValidation = createUserValidation.partial()

export const loginValidation = z.object({
  email: z.string(),
  password: z.string(),
})

export type CreateUser = z.infer<typeof createUserValidation>
export type UpdateUser = z.infer<typeof updateUserValidation>
export type LoginUser = z.infer<typeof loginValidation>
