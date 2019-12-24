import DbUtils from '../../DbUtils'
var fs = require('fs')
import { setsDbPath } from '../../../config/local-db-config'
import { getExerciseById } from '../../dao/ExerciseDao'
import { isUndefined } from 'util'
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

  getInflatedSets = () => {
    if (fs.existsSync(setsDbPath)) {
      var setsJson = fs.readFileSync(setsDbPath, 'utf8')
      var sets = JSON.parse(setsJson)
      let inflatedSets = sets.map( set => {
        return this.getInflatedSetById(set.id)
      })
      return inflatedSets
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

    if(isUndefined(foundSet)){
      throw new Error(`No set found matching id ${id}`)
    }

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
    if (Array.isArray(sets)) {
      sets.forEach(set => {
        this.addSet(set)
      })
    }
    // validate()
  }

  addSet = set => {
    set.id = this.dbUtils.assignId(set)
    let sanitizedSet = this.clearExercisesFromSet(set)
    var sets = this.getSets()
    sets.push(sanitizedSet)
    this._updateDb(sets)
    return set
  }

  clearExercisesFromSet = set => {
    let exercises = set.exercises.map( exercise => {
        return { id: exercise.id, reps: exercise.reps }
    })
    set.exercises = exercises
    return set
  }

  updateSet = update => {
    let updatedSet = this.clearExercisesFromSet(update)
    let sets = this.getSets()
    let index = sets.findIndex(set => {
      return Number(set.id) === Number(update.id)
    })
    let currentSet = { ...sets[index] }
    let merged = { ...currentSet, ...updatedSet }
    sets[index] = merged
    this._updateDb(sets)
    return merged
  }

  deleteSet = id => {
    // TODO: validate the id
    let sets = this.getSets()
    let index = sets.findIndex(set => {
      return Number(set.id) === Number(id)
    })
    console.log(`found index ${index} for set id ${id}`)
    let deletedSet = sets.splice(index,1)
    this._updateDb(sets)
    console.log(`deleted set with id ${id}`)

    return deletedSet
  }

  _updateDb = sets => {
    this.dbUtils.updateDb(sets, setsDbPath)
  }
}

export default SetsDao
