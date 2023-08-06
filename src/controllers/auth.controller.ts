import AuthService from '@/services/auth.service'
import { CreateUser } from '@/validations/users.validation'
import { Request, Response } from 'express'

class AuthController {
  public authService = new AuthService()

  public signUp = async (
    req: Request<any, any, CreateUser>,
    res: Response<ApiResponse>
  ) => {
    try {
      await this.authService.signUp(req.body)

      return res.status(200).json({ success: true })
    } catch (e) {
      return res
        .status(500)
        .json({ success: false, message: 'An error occurred' })
    }
  }
  public logIn = async (
    req: Request<any, any, CreateUser>,
    res: Response<ApiResponse>
  ) => {
    try {
      const { authCookie } = await this.authService.logIn(req.body)

      res.setHeader('Set-Cookie', [authCookie])
      return res.status(200).json({ success: true })
    } catch (e) {
      return res
        .status(500)
        .json({ success: false, message: 'An error occurred' })
    }
  }

  public logOut = async (_: Request, res: Response<ApiResponse>) => {
    res.setHeader('Set-Cookie', ['Authorization=; Max-age=0'])
    return res.status(200).json({ success: true })
  }
}

export default AuthController
