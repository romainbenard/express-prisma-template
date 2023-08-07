import config from '@/config'
import prisma from '@/lib/prisma'
import { DataStoredInToken, RequestWithUser } from '@/types/auth'
import { NextFunction, Response } from 'express'
import { verify } from 'jsonwebtoken'

const isAuthenticated = async (
  req: RequestWithUser,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const { secretKey } = config

  try {
    const Authorization =
      req.cookies['Authorization'] ||
      req.header('Authorization')?.split('Bearer ')[1] ||
      null

    if (!Authorization)
      return res.status(401).json({ success: false, message: 'Not allowed' })

    const { id: userId } = (await verify(
      Authorization,
      secretKey
    )) as DataStoredInToken

    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user)
      return res
        .status(401)
        .json({ success: false, message: 'Wrong authentication token' })

    const { id, email, name } = user
    req.currentUser = { id, email, name }

    next()
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: 'Authentication failed' })
  }
}

export default isAuthenticated
