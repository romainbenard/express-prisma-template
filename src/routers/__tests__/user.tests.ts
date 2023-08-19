import { describe, expect, it } from '@jest/globals'
import app from '../../app'
import supertest from 'supertest'
import prisma from '../../lib/prisma'
import {
  userOneFixture,
  userThreeFixture,
  userTwoFixture,
} from '../__fixtures__/userFixtures'
import createUserAndLogin from '../../utils/test/createUserAndLogin'

describe('src/routers/user.routes.ts', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany()
    jest.clearAllMocks()
  })

  describe('/users', () => {
    it('should return an error status if request failed', async () => {
      jest.spyOn(prisma.user, 'findMany').mockRejectedValueOnce(null)

      const res = await supertest(app).get('/users')

      expect(res.status).toBe(500)
      expect(res.body).toHaveProperty('message', 'Get users failed')
    })

    it('should return an empty array if no users exist', async () => {
      const res = await supertest(app).get('/users')

      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        success: true,
        data: [],
      })
    })

    it('should return the list of all users', async () => {
      await prisma.user.createMany({
        data: [userOneFixture, userTwoFixture, userThreeFixture],
      })

      const res = await supertest(app).get('/users')

      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        success: true,
        data: [
          {
            ...userOneFixture,
            createdAt: new Date(1, 1, 1).toISOString(),
            updatedAt: new Date(1, 1, 1).toISOString(),
          },
          {
            ...userTwoFixture,
            createdAt: new Date(1, 1, 1).toISOString(),
            updatedAt: new Date(1, 1, 1).toISOString(),
          },
          {
            ...userThreeFixture,
            createdAt: new Date(1, 1, 1).toISOString(),
            updatedAt: new Date(1, 1, 1).toISOString(),
          },
        ],
      })
    })
  })

  describe('/users/:id', () => {
    it('should return 401 if user is not authentified', async () => {
      const res = await supertest(app).get('/users/2')

      expect(res.status).toBe(401)
    })

    it('should not allowed access if other user try to access data of other user', async () => {
      const token = await createUserAndLogin(
        'userOne@test.co',
        'azerty',
        'John',
        '1'
      )

      const res = await supertest(app)
        .get('/users/2')
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(403)
    })

    it('should return the expected user', async () => {
      const token = await createUserAndLogin(
        'user@test.co',
        'azerty',
        'John',
        '3'
      )

      const res = await supertest(app)
        .get('/users/3')
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(200)

      expect(res.body).toHaveProperty('success', true)
      expect(res.body.data).toHaveProperty('id', '3')
      expect(res.body.data).toHaveProperty('email', 'user@test.co')
      expect(res.body.data).toHaveProperty('name', 'John')
    })
  })
})
