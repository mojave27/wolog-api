import WorkoutsDataSource from '../datasources/local/WorkoutsDataSource'
const dataSource = new WorkoutsDataSource()
// import validate from 'validate.js'

//TODO: add logger
exports.addWorkout = workout => {
  return dataSource.addWorkout(workout)
}

// gets full workouts (inflates exercises in sets)
exports.getWorkouts = () => {
  return dataSource.getWorkouts()
}

exports.getWorkoutById = id => {
  return dataSource.getWorkoutById(id)
}

exports.updateWorkout = workout => {
  return dataSource.updateWorkout(workout)
}

exports.deleteWorkout = id => {
  return dataSource.deleteWorkout(id)
}

exports.removeSetFromWorkouts = id => {
  let workouts = dataSource.getWorkouts()
  workouts.forEach( workout => {
    let index = workout.sets.findIndex( set => Number(set.id) === Number(id))
    if ( index >= 0 ) {
      console.log(`found set with id ${id} in workout with id ${workout.id}`)
      workout.sets.splice(index,1)      
      dataSource.updateWorkout(workout)
    }
  })
}