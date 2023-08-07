import UsersController from '@/controllers/users.controller'
import isAuthenticated from '@/middlewares/isAuthenticated'
import { validateBody } from '@/middlewares/validate'
import { updateUserValidation } from '@/validations/users.validation'
import { Router } from 'express'

const usersRouter = Router()
const { getUsers, getUserById, updateUser, deleteUser } = new UsersController()

usersRouter.get('/', isAuthenticated, getUsers)

usersRouter.get('/:id', getUserById)

usersRouter.put('/:id', validateBody(updateUserValidation), updateUser)

usersRouter.delete('/:id', deleteUser)

export default usersRouter
