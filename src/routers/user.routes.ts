import UsersController from '@/controllers/users.controller'
import isAuthenticated from '@/middlewares/isAuthenticated.middleware'
import { validateBody } from '@/middlewares/validate.middleware'
import { updateUserValidation } from '@/validations/users.validation'
import { Router } from 'express'

const usersRouter = Router()
const { getUsers, getUserById, updateUser, deleteUser } = new UsersController()

usersRouter.get('/', isAuthenticated, getUsers)

usersRouter.get('/:id', isAuthenticated, getUserById)

usersRouter.put(
  '/:id',
  validateBody(updateUserValidation),
  isAuthenticated,
  updateUser
)

usersRouter.delete('/:id', isAuthenticated, deleteUser)

export default usersRouter
