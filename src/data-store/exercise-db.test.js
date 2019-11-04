import exerciseDb from './exercise-db'
import fs from 'fs'
import { JestEnvironment } from '@jest/environment'
import { exportAllDeclaration } from '@babel/types'

jest.mock('fs')

const exercises = [
  { name: 'chins', type: 'compound', id: 0 },
  { name: 'dips', type: 'compound', id: 1 },
  { name: 'lat raise', type: 'isolation', id: 2 },
  { name: 'lat raise', type: 'isolation', id: 3 },
  { name: 'squat', type: 'compound', id: 4 },
  { name: 'deadlift', type: 'compound', id: 5 },
  { name: 'calf raise', type: 'isolation', id: 6 }
]

const setupFsMocks = () => {
    fs.existsSync.mockReturnValue(true)
    fs.readFileSync.mockReturnValue(exercises)
    JSON.parse = jest.fn().mockImplementationOnce(() => {
      return exercises
    })
}

describe('assignId tests', () => {
    beforeEach(() => {
        setupFsMocks()
    })

  it('returns same id, if valid', () => {
    const item = { id: 3 }
    expect(exerciseDb.assignId(item)).toBe(3)
  })
})
