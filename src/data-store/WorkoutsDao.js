import DbUtils from './DbUtils'
var fs = require('fs')
// import validate from 'validate.js'

// externalize the file/db path to a config or env
const workoutsDbPath = 'src/data-store/workouts.json'

//TODO: add logger
class WorkoutsDb {
  constructor() {
		this.dbUtils = new DbUtils(this.getWorkouts)
  }

  getWorkouts = () => {
    if (fs.existsSync(workoutsDbPath)) {
      var workoutsJson = fs.readFileSync(workoutsDbPath, 'utf8')
      var workouts = JSON.parse(workoutsJson)
      return workouts
    } else {
      throw new Error('workout db failure.')
    }
  }

  getWorkoutById = id => {
    // console.log(`getWorkoutById ${id}`)
    // TODO: validate the id

    const workouts = this.getWorkouts(id)
    let foundWorkout = workouts.find( workout => {
      return workout.id == id
    })

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

export default WorkoutsDb
