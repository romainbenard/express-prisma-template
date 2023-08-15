import config from '@/config'
import prisma from '@/lib/prisma'
import { DataStoredInToken } from '@/types/auth'
import HttpError from '@/utils/httpError'
import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

const isAuthenticated = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const { secretKey } = config

  try {
    const Authorization =
      req.cookies['Authorization'] ||
      req.header('Authorization')?.split('Bearer ')[1] ||
      null

    if (!Authorization) {
      const error = new HttpError(401, 'Not allowed')

      return next(error)
    }

    const { id: userId } = (await verify(
      Authorization,
      secretKey
    )) as DataStoredInToken

    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      const error = new HttpError(401, 'Wrong authentication token')

      return next(error)
    }

    const { id, email, name } = user
    req.currentUser = { id, email, name }

    next()
  } catch (err) {
    return next(err)
  }
}

export default isAuthenticated
