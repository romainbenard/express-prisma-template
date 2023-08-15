import type { Config } from 'jest'

export default async (): Promise<Config> => {
  return {
    verbose: true,
    testEnvironment: 'node',
    coveragePathIgnorePatterns: ['/node_modules/'],
  }
}
