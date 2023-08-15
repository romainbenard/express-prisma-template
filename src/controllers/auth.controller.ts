import AuthService from '@/services/auth.service'
import { CreateUser } from '@/validations/users.validation'
import { NextFunction, Request, Response } from 'express'

class AuthController {
  public authService = new AuthService()

  public signUp = async (
    req: Request<any, any, CreateUser>,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    try {
      await this.authService.signUp(req.body)

      return res.status(200).json({ success: true })
    } catch (e) {
      return next(e)
    }
  }
  public logIn = async (
    req: Request<any, any, CreateUser>,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    try {
      const { authCookie } = await this.authService.logIn(req.body)

      res.setHeader('Set-Cookie', [authCookie])
      return res.status(200).json({ success: true, message: 'Logged in' })
    } catch (e) {
      return next(e)
    }
  }

  public logOut = async (req: Request, res: Response<ApiResponse>) => {
    res.setHeader('Set-Cookie', ['Authorization=; Max-age=0'])
    return res.status(200).json({ success: true, message: 'Logged out' })
  }
}

export default AuthController
