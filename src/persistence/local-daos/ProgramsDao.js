import ProgramsDataSource from './ProgramsDataSourceLocal'
import WorkoutsDao from './WorkoutsDao'
import ExerciseDao from './ExerciseDao'
import SetsDao from './SetsDao'

const exerciseDao = new ExerciseDao()
const programsDataSource = new ProgramsDataSource()
const setsDao = new SetsDao()
const workoutsDao = new WorkoutsDao()

// export const ProgramsDao = {
// NEED TO CHANGE THIS TO A CLASS SO IT CAN
// INSTANTIATE A CLASS OF ProgramsDataSource
exports.getPrograms = () => {
  return programsDataSource.getPrograms()
}

exports.getProgramById = programId => {
  return programsDataSource.getProgramById()
}

exports.getFullProgram = programId => {
  const program = programsDataSource.getProgramById(programId)

  // get each workout for the program
  const workouts = program.workouts.map(workout => {
    let workoutWithSets = workoutsDao.getWorkoutById(workout.id)

    // get the inflated workout sets
    let inflatedSets = workoutWithSets.sets.map(set => {
      let inflatedSet = setsDao.getSetById(set.id)

      // get the inflated exercises
      let setWithExercises = inflatedSet.exercises.map(exercise => {
        let tempExercise = exerciseDao.getExerciseById(exercise.id)
        let fullExercise = { ...exercise, ...tempExercise }
        return fullExercise
      })

      inflatedSet.exercises = { ...setWithExercises }

      return inflatedSet
    })

    workoutWithSets.sets = inflatedSets

    return workoutWithSets
  })

  let fullProgram = { ...program }
  fullProgram.workouts = workouts

  return fullProgram
}

exports.addProgram = program => {
  return programsDataSource.addProgram(program)
}
