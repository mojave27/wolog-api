import fs from 'fs'
import ExerciseDb from './exercise-db'

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

describe('getExercises tests', () => {
    let exerciseDb = null
    beforeEach(() => {
        setupFsMocks()
        exerciseDb = new ExerciseDb()
    })

  it('returns expected exercises', () => {
    let exerciseList = exerciseDb.getExercises()
    expect(exerciseList.length).toBe(7)
    expect(exerciseList).toEqual(expect.arrayContaining(exercises));
  })
  
})
