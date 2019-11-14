import ProgramsDao from './local-daos/ProgramsDao'
import WorkoutsDao from './local-daos/WorkoutsDao'
import ExerciseDao from './local-daos/ExerciseDao'
import SetsDao from './local-daos/SetsDao'

const exerciseDao = new ExerciseDao()
const programsDao = new ProgramsDao()
const setsDao = new SetsDao()
const workoutsDao = new WorkoutsDao()

/*****************************************************************
   TODO: should this be the DAO class?  and the DAO class moved  *
   to a platform specific class?                                 *
******************************************************************/
export const retrieveFullProgram = programId => {
  const program = programsDao.getProgramById(programId)

  // get each workout for the program
  const workouts = program.workouts.map(workout => {
    let workoutWithSets = workoutsDao.getWorkoutById(workout.id)

    // get the inflated workout sets
    let inflatedSets = workoutWithSets.sets.map(set => {
      let inflatedSet = setsDao.getSetById(set.id)

      // get the inflated exercises
      let setWithExercises = inflatedSet.exercises.map(exercise => {
        let tempExercise = exerciseDao.getExerciseById(exercise.id)
        let fullExercise = {...exercise, ...tempExercise}
        return fullExercise
      })

      inflatedSet.exercises = {...setWithExercises}

      return inflatedSet
    })

    workoutWithSets.sets = inflatedSets

    return workoutWithSets
  })

  let fullProgram = { ...program }
  fullProgram.workouts = workouts

  return fullProgram
}
