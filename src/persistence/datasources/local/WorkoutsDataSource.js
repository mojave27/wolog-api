import DbUtils from '../../DbUtils'
var fs = require('fs')
import { workoutsDbPath } from '../../../config/local-db-config'
import { getInflatedSetById } from '../../dao/SetsDao'
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
      let fullWorkouts = this.inflateWorkouts(workouts)
      return fullWorkouts
    } else {
      throw new Error('workout db failure.')
    }
  }

  inflateWorkouts = workouts => {
    // let inflatedWorkouts = workouts.map( wo => {
    return workouts.map( wo => {
      let inflatedSets = wo.sets.map( set => {
        return getInflatedSetById(set.id)
      })
      let inflatedWorkout = {...wo}
      inflatedWorkout.sets = inflatedSets
      return inflatedWorkout
    })
  }

  getWorkoutById = id => {
    // TODO: validate the id
    const workouts = this.getWorkouts(id)
    let foundWorkout = workouts.find( workout => {
      return workout.id == id
    })

    //TODO: handle error if workout not found
    if (isUndefined(foundWorkout)){
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

  addWorkouts = (workouts) => {
    if (Array.isArray(workouts)) {
      workouts.forEach(workout => {
        this.addWorkout(workout)
      })
    }
    // validate()
  }

  addWorkout = (workout) => {
    workout.id = this.dbUtils.assignId(workout)
    var workouts = this.getWorkouts()
    workouts.push(workout)
    this._updateDb(workouts)
    return workout
  }

  updateWorkout = (update) => {
    // workout.id = this.dbUtils.assignId(workout)
    let workouts = this.getWorkouts()
    let index = workouts.findIndex( workout => {
      return Number(workout.id) === Number(update.id)
    })
    let currentWorkout = {...workouts[index]}
    let merged = {...currentWorkout, ...update};
    workouts[index] = merged
    this._updateDb(workouts)
    return merged
  }

  deleteWorkout = id => {
    let workouts = this.getWorkouts()
    let index = workouts.findIndex( workout => {
      return Number(workout.id) === Number(id)
    })
    let deletedWorkout = workouts.splice(index, 1);
    this._updateDb(workouts)
    console.log(`deleted workout with id ${deletedWorkout.id}`)
    // clean up deleted workout from any programs.
    removeWorkoutFromPrograms(id)
    return deletedWorkout
  }

  assignId = (item) => {
    // if id is invalid, generate one.
    if (typeof item.id === 'undefined' || item.id < 0) {
      return this.generateNewId()
    } else if (this.isIdInUse(item.id)) {
      return this.generateNewId()
    } else {
      return item.id
    }
  }

  _updateDb = (workouts) => {
    this.dbUtils.updateDb(workouts, workoutsDbPath)
  }
}

export default WorkoutsDao
