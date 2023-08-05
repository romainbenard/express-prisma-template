import UsersController from '@/controllers/users.controller'
import { validateBody } from '@/middlewares/validate'
import {
  createUserValidation,
  updateUserValidation,
} from '@/validations/users.validation'
import { Router } from 'express'

const usersRouter = Router()
const { createUser, getUsers, getUserById, updateUser, deleteUser } =
  new UsersController()

usersRouter.get('/', getUsers)

usersRouter.get('/:id', getUserById)

usersRouter.post('/', validateBody(createUserValidation), createUser)

usersRouter.put('/:id', validateBody(updateUserValidation), updateUser)

usersRouter.delete('/:id', deleteUser)

export default usersRouter
