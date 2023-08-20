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
  beforeAll(async () => {
    await prisma.user.deleteMany()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /users', () => {
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
      expect(res.body).toMatchObject({
        success: true,
        data: [
          { email: 'userOne@test.co', name: 'User One', password: 'azerty' },
          { email: 'userTwo@test.co', name: 'User Two', password: '12345' },
          { email: 'userThree@test.co', name: 'User Three', password: 'abcd' },
        ],
      })
    })
  })

  describe('GET /users/:id', () => {
    it('should return 401 if user is not authentified', async () => {
      const res = await supertest(app).get('/users/2')

      expect(res.status).toBe(401)
    })

    it('should not allowed access if other user try to access data of other user', async () => {
      await prisma.user.createMany({
        data: [
          { email: 'user-bob@test.co', name: 'Bob', password: 'azerty' },
          { email: 'user-alice@test.co', name: 'Alice', password: '12345' },
        ],
      })

      const Id = '111'
      const token = await createUserAndLogin(
        'user-john@test.co',
        'azerty',
        'John',
        Id
      )

      const res = await supertest(app)
        .get(`/users/1`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(403)
    })

    it('should return the expected user', async () => {
      const Id = '222'
      const token = await createUserAndLogin(
        'user-patrick@test.co',
        'azerty',
        'Patrick',
        Id
      )

      const res = await supertest(app)
        .get(`/users/${Id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(200)

      expect(res.body).toHaveProperty('success', true)
      expect(res.body.data).toHaveProperty('id', '222')
      expect(res.body.data).toHaveProperty('email', 'user-patrick@test.co')
      expect(res.body.data).toHaveProperty('name', 'Patrick')
    })
  })
})
