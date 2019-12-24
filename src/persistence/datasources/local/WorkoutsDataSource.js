import DbUtils from '../../DbUtils'
var fs = require('fs')
import { workoutsDbPath } from '../../../config/local-db-config'
import { addSet, getInflatedSetById, updateSet } from '../../dao/SetsDao'
import { removeWorkoutFromPrograms } from '../../dao/ProgramsDao'
import { isUndefined } from 'lodash'
// import validate from 'validate.js'

//TODO: add logger
class WorkoutsDao {
  constructor() {
    this.dbUtils = new DbUtils(this.getWorkouts)
  }

  getWorkouts = () => {
    if (fs.existsSync(workoutsDbPath)) {
      let workoutsJson = fs.readFileSync(workoutsDbPath, 'utf8')
      let workouts = JSON.parse(workoutsJson)
      return workouts
    } else {
      throw new Error('workout db failure.')
    }
  }

  getFullWorkouts = () => {
    if (fs.existsSync(workoutsDbPath)) {
      let workoutsJson = fs.readFileSync(workoutsDbPath, 'utf8')
      let workouts = JSON.parse(workoutsJson)
      let fullWorkouts = this.inflateWorkouts(workouts)
      return fullWorkouts
    } else {
      throw new Error('workout db failure.')
    }
  }

  inflateWorkouts = workouts => {
    // let inflatedWorkouts = workouts.map( wo => {
    return workouts.map(wo => {
      return this.inflateWorkout(wo)
      // let inflatedSets = wo.sets.map( set => {
      //   return getInflatedSetById(set.id)
      // })
      // let inflatedWorkout = {...wo}
      // inflatedWorkout.sets = inflatedSets
      // return inflatedWorkout
    })
  }

  inflateWorkout = workout => {
    let inflatedSets = workout.sets.map(set => {
      return getInflatedSetById(set.id)
    })
    let inflatedWorkout = { ...workout }
    inflatedWorkout.sets = inflatedSets
    return inflatedWorkout
  }

  getWorkoutById = id => {
    // TODO: validate the id
    const workouts = this.getFullWorkouts()
    let foundWorkout = workouts.find(workout => {
      return workout.id == id
    })

    console.log(JSON.stringify(foundWorkout))

    //TODO: handle error if workout not found
    if (isUndefined(foundWorkout)) {
      throw new Error('no workout found with id: ' + id)
    }

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
    if (Array.isArray(workouts)) {
      workouts.forEach(workout => {
        this.addWorkout(workout)
      })
    }
    // validate()
  }

  addWorkout = workout => {
    workout.id = this.dbUtils.assignId(workout)
    var workouts = this.getWorkouts()
    workouts.push(workout)
    this.saveSets(workout.sets)
    this._updateDb(workouts)
    return this.inflateWorkout(workout)
  }

  updateWorkout = update => {
    let updatedWorkout = this.clearExercisesFromSets(update)
    let workouts = this.getWorkouts()
    let index = workouts.findIndex(workout => {
      return Number(workout.id) === Number(update.id)
    })
    let currentWorkout = { ...workouts[index] }
    let merged = { ...currentWorkout, ...updatedWorkout }
    workouts[index] = merged
    this.saveSets(updatedWorkout.sets)
    this._updateDb(workouts)
    return this.inflateWorkout(merged)
  }

  clearExercisesFromSets = workout => {
    let cleanedSets = []
    workout.sets.forEach(set => {
      if (set.exercises) {
        let exercises = set.exercises.map(exercise => {
          return { id: exercise.id, reps: exercise.reps }
        })
        set.exercises = exercises
      }
      cleanedSets.push(set)
    })

    workout.sets = cleanedSets
    return workout
  }

  deleteWorkout = id => {
    // TODO: validate the id
    let workouts = this.getWorkouts()
    let index = workouts.findIndex(workout => {
      return Number(workout.id) === Number(id)
    })
    console.log(`found index ${index} for workout id ${id}`)
    let deletedWorkout = workouts.splice(index, 1)
    this._updateDb(workouts)
    console.log(`deleted workout with id ${deletedWorkout.id}`)
    // clean up deleted workout from any programs.
    removeWorkoutFromPrograms(id)
    return deletedWorkout
  }

  saveSets = sets => {
    sets.forEach(set => {
      if (set.id) {
        updateSet(set)
      } else {
        addSet(set)
      }
    })
  }

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
