import WorkoutsDataSource from '../datasources/local/WorkoutsDataSource'
const workoutsDataSource = new WorkoutsDataSource()
// import validate from 'validate.js'

//TODO: add logger
exports.addWorkout = workout => {
  return workoutsDataSource.addWorkout(workout)
}

// gets full workouts (inflates exercises in sets)
exports.getWorkouts = () => {
  return workoutsDataSource.getFullWorkouts()
}

exports.getWorkoutById = id => {
  return workoutsDataSource.getWorkoutById(id)
}

exports.updateWorkout = workout => {
  return workoutsDataSource.updateWorkout(workout)
}

exports.deleteWorkout = id => {
  return workoutsDataSource.deleteWorkout(id)
}

exports.removeSetFromWorkouts = id => {
  let workouts = workoutsDataSource.getWorkouts()
  workouts.forEach( workout => {
    let index = workout.sets.findIndex( set => Number(set.id) === Number(id))
    if ( index >= 0 ) {
      console.log(`found set with id ${id} in workout with id ${workout.id}`)
      workout.sets.splice(index,1)      
      workoutsDataSource.updateWorkout(workout)
    }
  })
}