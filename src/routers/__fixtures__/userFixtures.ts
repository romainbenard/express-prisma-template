import { User } from '@prisma/client'

export const userOneFixture: User = {
  id: '1',
  email: 'userOne@test.co',
  name: 'User One',
  password: 'azerty',
  createdAt: new Date(1, 1, 1),
  updatedAt: new Date(1, 1, 1),
}

export const userTwoFixture: User = {
  id: '2',
  email: 'userTwo@test.co',
  name: 'User Two',
  password: '12345',
  createdAt: new Date(1, 1, 1),
  updatedAt: new Date(1, 1, 1),
}

export const userThreeFixture: User = {
  id: '3',
  email: 'userThree@test.co',
  name: 'User Three',
  password: 'aa11bb22',
  createdAt: new Date(1, 1, 1),
  updatedAt: new Date(1, 1, 1),
}
