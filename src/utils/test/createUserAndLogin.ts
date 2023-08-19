import { hash } from 'bcrypt'
import prisma from '../../lib/prisma'
import supertest from 'supertest'
import app from '../../app'

const createUserAndLogin = async (
  email: string,
  password: string,
  name?: string,
  id?: string
) => {
  const passwordFixture = await hash(password, 10)

  await prisma.user.create({
    data: {
      id,
      email,
      name: name || 'Default Name',
      password: passwordFixture,
    },
  })

  const login = await supertest(app)
    .post('/auth/login')
    .send({ email, password })

  const token: string = login.headers['set-cookie'][0]
    .split(';')[0]
    .split('Authorization=')[1]

  return token
}

export default createUserAndLogin
