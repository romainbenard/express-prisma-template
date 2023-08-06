import prisma from '@/lib/prisma'
import { CreateUser } from '@/validations/users.validation'
import { User } from '@prisma/client'

class UsersService {
  public getUsers = async (): Promise<User[]> => {
    try {
      return await prisma.user.findMany()
    } catch (e) {
      throw new Error(e as string)
    }
  }

  public getUserById = async (id: string): Promise<User | null> => {
    try {
      return await prisma.user.findUnique({
        where: {
          id,
        },
      })
    } catch (e) {
      throw new Error(e as string)
    }
  }

  public createUser = async (data: CreateUser): Promise<User> => {
    try {
      return await prisma.user.create({
        data,
      })
    } catch (e) {
      throw new Error(e as string)
    }
  }

  public updateUser = async (
    id: string,
    data: Partial<User>
  ): Promise<User> => {
    try {
      return await prisma.user.update({
        where: {
          id,
        },
        data,
      })
    } catch (e) {
      throw new Error(e as string)
    }
  }

  public deleteUser = async (id: string): Promise<User> => {
    try {
      return await prisma.user.delete({
        where: {
          id,
        },
      })
    } catch (e) {
      throw new Error(e as string)
    }
  }
}

export default UsersService
