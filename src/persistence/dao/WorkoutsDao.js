import WorkoutsDataSource from '../datasources/local/WorkoutsDataSource'
const workoutsDataSource = new WorkoutsDataSource()
// import validate from 'validate.js'

//TODO: add logger
exports.getWorkouts = () => {
  return workoutsDataSource.getWorkouts()
}

exports.getWorkoutById = id => {
  return workoutsDataSource.getWorkoutById(id)
}

exports.addWorkout = workout => {
  return workoutsDataSource.addWorkout(workout)
}

exports.updateWorkout = workout => {
  return workoutsDataSource.updateWorkout(workout)
}