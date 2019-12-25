import DbUtils from '../../DbUtils'
var fs = require('fs')
import { setsDbPath } from '../../../config/local-db-config'
import { getExerciseById } from '../../dao/ExerciseDao'
import { isUndefined } from 'util'
import Logger from '../../../logging/Logger'
// import validate from 'validate.js'

const log = new Logger('SetsDataSource')

//TODO: add logger
class SetsDao {
  constructor() {
    this.dbUtils = new DbUtils(this.getSets)
  }

  getSets = () => {
    // log.info(`getting sets`)
    if (fs.existsSync(setsDbPath)) {
      var setsJson = fs.readFileSync(setsDbPath, 'utf8')
      var sets = JSON.parse(setsJson)
      return sets
    } else {
      throw new Error('set db failure.')
    }
  }

  getInflatedSets = () => {
    log.info(`getting inflated sets`)
    if (fs.existsSync(setsDbPath)) {
      var setsJson = fs.readFileSync(setsDbPath, 'utf8')
      var sets = JSON.parse(setsJson)
      let inflatedSets = sets.map(set => {
        return this.getInflatedSetById(set.id)
      })
      return inflatedSets
    } else {
      throw new Error('set db failure.')
    }
  }

  getSetById = id => {
    log.info(`getting set with id ${id}`)
    // TODO: validate the id

    const sets = this.getSets()
    let foundSet = sets.find(set => {
      return set.id == id
    })

    if (isUndefined(foundSet)) {
      throw new Error(`No set found matching id ${id}`)
    }

    return foundSet
  }

  getInflatedSetById = id => {
    log.info(`getting inflated set with id ${id}`)
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
    log.info(`adding sets`)
    if (Array.isArray(sets)) {
      sets.forEach(set => {
        this.addSet(set)
      })
    }
    // validate()
  }

  addSet = set => {
    if (set.id) {
      log.info(`set already has id ${id}, not adding.`)
      return set
    } else {
      log.info(`adding set ${JSON.stringify(set)}`)
      set.id = this.dbUtils.assignId(set)
      log.info(`  assigning id ${set.id}`)
      let sanitizedSet = this.clearExercisesFromSet(set)
      var sets = this.getSets()
      sets.push(sanitizedSet)
      this._updateDb(sets)
      log.info(`  added set ${JSON.stringify(sanitizedSet)}`)
      return set
    }
  }

  updateSet = update => {
    log.info(`updating set with id ${update.id}`)
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

  clearExercisesFromSet = set => {
    let exercises = set.exercises.map(exercise => {
      return { id: exercise.id, reps: exercise.reps }
    })
    set.exercises = exercises
    return set
  }

  deleteSet = id => {
    log.info(`deleting set with id ${id}`)
    // TODO: validate the id
    let sets = this.getSets()
    let index = sets.findIndex(set => {
      return Number(set.id) === Number(id)
    })
    console.log(`found index ${index} for set id ${id}`)
    let deletedSet = sets.splice(index, 1)
    this._updateDb(sets)
    console.log(`deleted set with id ${id}`)

    return deletedSet
  }

  _updateDb = sets => {
    this.dbUtils.updateDb(sets, setsDbPath)
  }
}

export default SetsDao
