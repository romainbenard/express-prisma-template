import config from '@/config'
import prisma from '@/lib/prisma'
import { DataStoredInToken, TokenData } from '@/types/auth'
import HttpError from '@/utils/httpError'
import { CreateUser, LoginUser } from '@/validations/users.validation'
import { User } from '@prisma/client'
import { compare, hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'

class AuthService {
  async signUp(data: CreateUser): Promise<User> {
    const { email, password, name } = data
    const findUser = await prisma.user.findUnique({
      where: { email },
    })

    if (findUser) throw new HttpError(401, 'User already exists')

    const hashedPassword = await hash(password, 10)
    const createdUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })

    return createdUser
  }

  async logIn(data: LoginUser): Promise<{ authCookie: string }> {
    const { email, password } = data

    const findUser = await prisma.user.findUnique({
      where: { email },
    })

    if (!findUser) throw new HttpError(404, 'Authentication failed')

    const isPasswordValid = await compare(password, findUser.password)

    if (!isPasswordValid) throw new HttpError(401, 'Authentication failed')

    const tokenData = this.#createToken(findUser.id)
    const authCookie = this.#createCookie(tokenData)

    return { authCookie }
  }

  #createToken(userId: string): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: userId }
    const secretKey: string = config.secretKey
    const expiresIn: number = 60 * 60

    return {
      token: sign(dataStoredInToken, secretKey, { expiresIn }),
      expiresIn,
    }
  }

  #createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`
  }
}

export default AuthService
