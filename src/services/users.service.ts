import { CreateUser } from '@/validations/users.validation'
import { PrismaClient, User } from '@prisma/client'

class UsersService {
  public users = new PrismaClient().user

  public getUsers = async (): Promise<User[]> => {
    try {
      return await this.users.findMany()
    } catch (e) {
      throw new Error(e as string)
    }
  }

  public getUserById = async (id: string): Promise<User | null> => {
    try {
      return await this.users.findUnique({
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
      return await this.users.create({
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
      return await this.users.update({
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
      return await this.users.delete({
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
