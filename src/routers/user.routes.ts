import UsersController from '@/controllers/users.controller'
import { Router } from 'express'

const usersRouter = Router()
const { createUser, getUsers, getUserById, updateUser, deleteUser } =
  new UsersController()

usersRouter.get('/', getUsers)

usersRouter.get('/:id', getUserById)

usersRouter.post('/', createUser)

usersRouter.put('/:id', updateUser)

usersRouter.delete('/:id', deleteUser)

export default usersRouter
