import ExerciseDataSource from '../datasources/local/ExerciseDataSource'
const exerciseDataSource = new ExerciseDataSource()
// import validate from 'validate.js'

//TODO: add logger

exports.getExercises = () => {
  return exerciseDataSource.getExercises()
}

exports.getExerciseById = id => {
  return exerciseDataSource.getExerciseById(id)
}

exports.addExercise = exercise => {
  exerciseDataSource.addExercise(exercise)
}

exports.deleteExerciseById = id => {
  exerciseDataSource.deleteExerciseById(id)
}
