import { describe, expect, it } from '@jest/globals'
import app from '../../app'
import supertest from 'supertest'
import prisma from '../../lib/prisma'
import { hash } from 'bcrypt'

describe('src/routers/auth.routes.ts', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  describe('/signup', () => {
    it('should failed if a body request is not valid', async () => {
      const res = await supertest(app).post('/auth/signup').send({
        email: 'test@test.co',
        name: 'userTest',
      })

      expect(res.status).toBe(400)
    })

    it('should failed if a user already exist', async () => {
      await prisma.user.create({
        data: { email: 'test@test.co', name: 'userTest', password: 'azerty' },
      })

      const res = await supertest(app).post('/auth/signup').send({
        email: 'test@test.co',
        name: 'userTest',
        password: 'azerty',
      })

      expect(res.status).toBe(401)
    })

    it('should succeed when a new user create an account', async () => {
      const res = await supertest(app).post('/auth/signup').send({
        email: 'test@test.co',
        name: 'userTest',
        password: 'azerty',
      })

      expect(res.status).toBe(200)
    })
  })

  describe('/login', () => {
    it('should failed if body request is not valid', async () => {
      const res = await supertest(app).post('/auth/login').send({
        email: 'login@test.co',
      })
      expect(res.status).toBe(400)
    })

    it('should failed if user not exist', async () => {
      const res = await supertest(app).post('/auth/login').send({
        email: 'unknown@test.co',
        password: '12345678',
      })

      expect(res.status).toBe(404)
    })

    it('should failed if password is not correct', async () => {
      const passwordFixture = await hash('azerty', 10)

      await prisma.user.create({
        data: {
          email: 'password@test.co',
          name: 'John',
          password: passwordFixture,
        },
      })

      const res = await supertest(app).post('/auth/login').send({
        email: 'password@test.co',
        password: '123456',
      })

      expect(res.status).toBe(401)
    })

    it('should create a Set-Cookie header and return user data after login', async () => {
      const passwordFixture = await hash('azerty', 10)
      await prisma.user.create({
        data: {
          email: 'login@test.co',
          name: 'John',
          password: passwordFixture,
        },
      })

      const res = await supertest(app).post('/auth/login').send({
        email: 'login@test.co',
        password: 'azerty',
      })

      expect(res.status).toBe(200)
      expect(res.headers).toHaveProperty('set-cookie')
      expect(res.body).toMatchObject({
        success: true,
        data: {
          email: 'login@test.co',
          name: 'John',
        },
      })
    })
  })

  describe('/logout', () => {
    it('should return 401 if user is not authentified', async () => {
      const res = await supertest(app).post('/auth/logout')

      expect(res.status).toBe(401)
    })

    it('should remove reset set-cookie header', async () => {
      const passwordFixture = await hash('azerty', 10)
      await prisma.user.create({
        data: {
          email: 'login@test.co',
          name: 'John',
          password: passwordFixture,
        },
      })

      const login = await supertest(app).post('/auth/login').send({
        email: 'login@test.co',
        password: 'azerty',
      })

      const token = login.headers['set-cookie'][0]
        .split(';')[0]
        .split('Authorization=')[1]

      const res = await supertest(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(200)
      expect(res.headers).toMatchObject({
        'set-cookie': ['Authorization=; Max-age=0'],
      })
    })
  })
})
