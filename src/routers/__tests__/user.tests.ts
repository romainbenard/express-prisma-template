import { describe, expect, it } from '@jest/globals'
import app from '../../app'
import supertest from 'supertest'
import prisma from '../../lib/prisma'
import {
  userOneFixture,
  userThreeFixture,
  userTwoFixture,
} from '../__fixtures__/userFixtures'

describe('src/routers/user.routes.ts', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany()
    jest.clearAllMocks()
  })

  describe('/', () => {
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
})
