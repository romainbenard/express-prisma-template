import { Request, Response } from 'express'
import UsersService from '@/services/users.service'
import { User } from '@prisma/client'
import { CreateUser, UpdateUser } from '@/validations/users.validation'

class UsersController {
  public usersService = new UsersService()

  public getUsers = async (_: Request, res: Response) => {
    try {
      const users = await this.usersService.getUsers()

      res.status(200).json({ success: true, data: users })
    } catch (e) {
      return res
        .status(500)
        .json({ success: false, message: 'An error occurred' })
    }
  }

  public getUserById = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<User | null>>
  ) => {
    const { id } = req.params
    try {
      const user = await this.usersService.getUserById(id)

      res.status(200).json({ success: true, data: user })
    } catch (e) {
      return res
        .status(500)
        .json({ success: false, message: 'An error occurred' })
    }
  }

  public createUser = async (
    req: Request<{ id: string }, any, CreateUser>,
    res: Response<ApiResponse<User>>
  ) => {
    try {
      const user: User = await this.usersService.createUser(req.body)

      return res.status(201).json({ success: true, data: user })
    } catch (e) {
      return res
        .status(500)
        .json({ success: false, message: 'User creation failed' })
    }
  }

  public updateUser = async (
    req: Request<{ id: string }, any, UpdateUser>,
    res: Response<ApiResponse<User>>
  ) => {
    const { body, params } = req

    try {
      const updatedUser = await this.usersService.updateUser(params.id, body)

      res.status(200).json({ success: true, data: updatedUser })
    } catch (e) {
      return res
        .status(500)
        .json({ success: false, message: 'User update failed' })
    }
  }

  public deleteUser = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse>
  ) => {
    try {
      const { id } = req.params
      await this.usersService.deleteUser(id)

      res.status(200).json({ success: true })
    } catch (e) {
      return res
        .status(500)
        .json({ success: false, message: 'User deletion failed' })
    }
  }
}

export default UsersController
