import AuthController from '@/controllers/auth.controller'
import isAuthenticated from '@/middlewares/isAuthenticated.middleware'
import { validateBody } from '@/middlewares/validate.middleware'
import {
  createUserValidation,
  loginValidation,
} from '@/validations/users.validation'
import { Router } from 'express'

const authRouter = Router()
const { signUp, logIn, logOut } = new AuthController()

authRouter.post('/signup', validateBody(createUserValidation), signUp)

authRouter.post('/login', validateBody(loginValidation), logIn)

authRouter.post('/logout', isAuthenticated, logOut)

export default authRouter
