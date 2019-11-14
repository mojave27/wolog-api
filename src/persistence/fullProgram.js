import ProgramsDao from './local-daos/ProgramsDao'
import WorkoutsDao from './local-daos/WorkoutsDao'
import ExerciseDao from './local-daos/ExerciseDao'
import SetsDao from './local-daos/SetsDao'
import { consoleLog as log } from '../logging/log'

const exerciseDao = new ExerciseDao()
const programsDao = new ProgramsDao()
const setsDao = new SetsDao()
const workoutsDao = new WorkoutsDao()

export const retrieveFullProgram = programId => {
  const program = programsDao.getProgramById(programId)
  console.log('\n============================================================')
  log('program', program, true)

//   log('program workouts', program.workouts, true)

  // get each workout for the program
  const workouts = program.workouts.map(workout => {
    console.log('\n------------------------------------')
    // log('workout', workout, true)

    let workoutWithSets = workoutsDao.getWorkoutById(workout.id)
    // log(' workoutWithSets', workoutWithSets, true)

    // get the workout sets
    let inflatedSets = workoutWithSets.sets.map(set => {
      let inflatedSet = setsDao.getSetById(set.id)
    //   log('  set', set, true)
    //   log('  inflatedSet', inflatedSet, true)
      //inflatedSet: {"id":1,"exercises":[{"id":0,"reps":"6-8-10"}]}

      // get the ex
      let setWithExercises = inflatedSet.exercises.map(exercise => {
        // log('    element', exercise, true)
        let tempExercise = exerciseDao.getExerciseById(exercise.id)
        // log('    tempExercise', tempExercise, true)
        let fullExercise = {...exercise, ...tempExercise}
        // log('    fullExercise', fullExercise, true)
        return fullExercise
      })

      inflatedSet.exercises = {...setWithExercises}

    //   log('  inflatedSet-updated', inflatedSet, true)
      return inflatedSet
    })

    workoutWithSets.sets = inflatedSets
    // log('  workoutWithSets-updated', workoutWithSets, true)

    // return fullWorkout
    return workoutWithSets
  })

  let fullProgram = { ...program }
  fullProgram.workouts = workouts

  log('fullProgram', fullProgram)

  // return the program AND its set of workouts
  return fullProgram
}
