import DbUtils from '../../DbUtils'
var fs = require('fs')
import { setsDbPath } from '../../../config/local-db-config'
import { getExerciseById } from '../../dao/ExerciseDao'
// import validate from 'validate.js'

//TODO: add logger
class SetsDao {
  constructor() {
    this.dbUtils = new DbUtils(this.getSets)
  }

  getSets = () => {
    if (fs.existsSync(setsDbPath)) {
      var setsJson = fs.readFileSync(setsDbPath, 'utf8')
      var sets = JSON.parse(setsJson)
      return sets
    } else {
      throw new Error('set db failure.')
    }
  }

  getSetById = id => {
    // TODO: validate the id

    const sets = this.getSets()
    let foundSet = sets.find(set => {
      return set.id == id
    })

    return foundSet
  }

  getInflatedSetById = id => {
    let inflatedSet = this.getSetById(id)
    // get the inflated exercises
    let setWithExercises = inflatedSet.exercises.map(exercise => {
      let tempExercise = getExerciseById(exercise.id)
      let fullExercise = { ...exercise, ...tempExercise }
      return fullExercise
    })

    inflatedSet.exercises = [...setWithExercises]

    return inflatedSet
  }

  addSets = sets => {
    // console.log(`[set-db] addSets()`)
    if (Array.isArray(sets)) {
      sets.forEach(set => {
        this.addSet(set)
      })
    }
    // validate()
  }

  addSet = set => {
    // console.log(`[set-db] addSet()`)
    set.id = this.dbUtils.assignId(set)
    var sets = this.getSets()
    sets.push(set)
    this._updateDb(sets)
  }

  _updateDb = sets => {
    this.dbUtils.updateDb(sets, setsDbPath)
  }
}

export default SetsDao
