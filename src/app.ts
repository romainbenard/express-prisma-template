import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

import validateEnv from '@utils/validateEnv'
import usersRouter from './routers/user.routes'
import authRouter from './routers/auth.routes'
import errorMiddleware from './middlewares/error.middleware'

dotenv.config()

validateEnv()

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use('/auth', authRouter)
app.use('/users', usersRouter)

app.use(errorMiddleware)

export default app
