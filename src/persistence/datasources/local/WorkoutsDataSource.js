import DbUtils from '../../DbUtils'
var fs = require('fs')
import { workoutsDbPath } from '../../../config/local-db-config'
// import { addSet, getInflatedSetById, updateSet } from '../../dao/SetsDao'
import { removeWorkoutFromPrograms } from '../../dao/ProgramsDao'
import { isUndefined } from 'lodash'
import Logger from '../../../logging/Logger'

// import validate from 'validate.js'
const log = new Logger('WorkoutsDataSource')

//TODO: add logger
class WorkoutsDao {
  constructor() {
    this.dbUtils = new DbUtils(this.getWorkouts)
  }

  getWorkouts = () => {
    // console.log(`getting workouts`)
    log.info(`getting workouts`)
    if (fs.existsSync(workoutsDbPath)) {
      let workoutsJson = fs.readFileSync(workoutsDbPath, 'utf8')
      let workouts = JSON.parse(workoutsJson)
      return workouts
    } else {
      throw new Error('workout db failure.')
    }
  }

  // getFullWorkouts = () => {
  //   log.info(`getting full workouts`)
  //   if (fs.existsSync(workoutsDbPath)) {
  //     let workoutsJson = fs.readFileSync(workoutsDbPath, 'utf8')
  //     let workouts = JSON.parse(workoutsJson)
  //     let fullWorkouts = this.inflateWorkouts(workouts)
  //     return fullWorkouts
  //   } else {
  //     throw new Error('workout db failure.')
  //   }
  // }

  // inflateWorkouts = workouts => {
  //   log.info(`inflating workouts`)
  //   return workouts.map(wo => {
  //     return this.inflateWorkout(wo)
  //   })
  // }

  // inflateWorkout = workout => {
  //   log.info(`inflating workout`)
  //   let inflatedSets = workout.sets.map(set => {
  //     return getInflatedSetById(set.id)
  //   })
  //   let inflatedWorkout = { ...workout }
  //   inflatedWorkout.sets = inflatedSets
  //   return inflatedWorkout
  // }

  getWorkoutById = id => {
    log.info(`getting workout with id ${id}`)
    // TODO: validate the id
    const workouts = this.getWorkouts()
    let foundWorkout = workouts.find(workout => {
      return workout.id == id
    })

    
    //TODO: handle error if workout not found
    if (isUndefined(foundWorkout)) {
      throw new Error('no workout found with id: ' + id)
    }
    log.info(`found workout: ${JSON.stringify(foundWorkout)}`)

    return foundWorkout
  }

  // returns array of unique, sorted ids
  getUniqueIds = () => {
    const workouts = this.getWorkouts()
    // make an array of the ids
    let ids = Array.from(workouts, workout => workout.id)
    // sort and ensure unique by converting to Set and back to array :)
    let uniqueIds = Array.from(new Set(ids.sort()))
    return uniqueIds
  }

  addWorkouts = workouts => {
    log.info(`adding workouts`)
    if (Array.isArray(workouts)) {
      workouts.forEach(workout => {
        this.addWorkout(workout)
      })
    }
    // validate()
  }

  addWorkout = workout => {
    if (workout.id) {
      // TODO: do a real lookup of the id to verify whether it exists.
      log(NAME,`workout already has an id ${workout.id}, will not add.`)
      return workout
    }
    log.info(`adding new workout ${JSON.stringify(workout)}`)
    workout.id = this.dbUtils.assignId(workout)
    log.info(`  assigning id ${workout.id} to workout.`)
    var workouts = this.getWorkouts()
    workouts.push(workout)
    // this.saveSets(workout.sets)
    this._updateDb(workouts)
    log.info(`  added new workout ${JSON.stringify(workout)}`)
    return workout
  }

  updateWorkout = update => {
    log.info(`updating existing workout with id ${update.id}`)
    let updatedWorkout = this.clearExercisesFromSets(update)
    let workouts = this.getWorkouts()
    let index = workouts.findIndex(workout => {
      return Number(workout.id) === Number(update.id)
    })
    let currentWorkout = { ...workouts[index] }
    let merged = { ...currentWorkout, ...updatedWorkout }
    workouts[index] = merged
    // this.saveSets(updatedWorkout.sets)
    this._updateDb(workouts)
    return merged
  }

  clearExercisesFromSets = workout => {
    console.log(JSON.stringify(workout))
    let cleanedExGroups = []
    workout.exerciseGroups.forEach(exGroup => {
      if (exGroup.exercises) {
        let exercises = exGroup.exercises.map(exercise => {
          console.log(exercise)
          return { id: exercise.id, name: exercise.name, reps: exercise.reps }
        })
        exGroup.exercises = exercises
      }
      cleanedExGroups.push(exGroup)
    })

    workout.exGroup = cleanedExGroups
    return workout
  }

  deleteWorkout = id => {
    log.info(`deleting existing workout with id ${id}`)
    // TODO: validate the id
    let workouts = this.getWorkouts()
    let index = workouts.findIndex(workout => {
      return Number(workout.id) === Number(id)
    })
    log.info(`found index ${index} for workout id ${id}`)
    let deletedWorkout = workouts.splice(index, 1)
    this._updateDb(workouts)
    log.info(`deleted workout with id ${deletedWorkout.id}`)
    // clean up deleted workout from any programs.
    removeWorkoutFromPrograms(id)
    return deletedWorkout
  }

  // saveSets = sets => {
  //   sets.forEach(set => {
  //     if (set.id) {
  //       log.info(`updating existing set with id ${set.id}`)
  //       updateSet(set)
  //     } else {
  //       log.info(`updating existing set with id ${set.id}`)
  //       addSet(set)
  //     }
  //   })
  // }

  assignId = item => {
    // if id is invalid, generate one.
    if (typeof item.id === 'undefined' || item.id < 0) {
      return this.generateNewId()
    } else if (this.isIdInUse(item.id)) {
      return this.generateNewId()
    } else {
      return item.id
    }
  }

  _updateDb = workouts => {
    this.dbUtils.updateDb(workouts, workoutsDbPath)
  }
}

export default WorkoutsDao
