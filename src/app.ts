import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import validateEnv from '@utils/validateEnv'
import router from './routers/route'
import usersRouter from './routers/user.routes'

dotenv.config()

validateEnv()

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.use('/', router)
app.use('/users', usersRouter)

app.use('*', (_, res) => {
  return res.status(404).json({ message: 'Route not found' })
})

export default app
