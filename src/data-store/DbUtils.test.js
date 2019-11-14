import DbUtil from './db-utils'

const exercises = [
  { name: 'chins', type: 'compound', id: 0 },
  { name: 'dips', type: 'compound', id: 1 },
  { name: 'lat raise', type: 'isolation', id: 2 },
  { name: 'lat raise', type: 'isolation', id: 3 },
  { name: 'squat', type: 'compound', id: 4 },
  { name: 'deadlift', type: 'compound', id: 5 },
  { name: 'calf raise', type: 'isolation', id: 6 }
]

const getItems = () => {
  return exercises
}

describe('isIdInUse tests', () => {
  let dbUtil = null
  beforeEach( () => {
    dbUtil = new DbUtil(getItems)
  })

  it('returns false when id is invalid', () => {
    const id = -1
    expect(dbUtil.isIdInUse(id, exercises)).toEqual(false)
  })

  it('returns false when id is NOT in the array', () => {
    const id = 99
    expect(dbUtil.isIdInUse(id, exercises)).toEqual(false)
  })

  it('returns true when id IS in the array', () => {
    const id = 3
    expect(dbUtil.isIdInUse(id)).toEqual(true)
  })
})
