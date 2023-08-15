import { NextFunction, Request, Response } from 'express'
import UsersService from '@/services/users.service'
import { User } from '@prisma/client'
import { UpdateUser } from '@/validations/users.validation'

class UsersController {
  public usersService = new UsersService()

  public getUsers = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.usersService.getUsers()

      res.status(200).json({ success: true, data: users })
    } catch (e) {
      return next(e)
    }
  }

  public getUserById = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<User | null>>,
    next: NextFunction
  ) => {
    const { id } = req.params
    try {
      const user = await this.usersService.getUserById(id)

      res.status(200).json({ success: true, data: user })
    } catch (e) {
      return next(e)
    }
  }

  public updateUser = async (
    req: Request<{ id: string }, any, UpdateUser>,
    res: Response<ApiResponse<User>>,
    next: NextFunction
  ) => {
    const { body, params } = req

    try {
      const updatedUser = await this.usersService.updateUser(params.id, body)

      res.status(200).json({ success: true, data: updatedUser })
    } catch (e) {
      return next(e)
    }
  }

  public deleteUser = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      await this.usersService.deleteUser(id)

      res.status(200).json({ success: true })
    } catch (e) {
      return next(e)
    }
  }
}

export default UsersController
