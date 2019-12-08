import ProgramsDataSource from '../datasources/local/ProgramsDataSource'
import { getExerciseById } from './ExerciseDao'
import { getWorkoutById } from './WorkoutsDao'
import { getSetById } from './SetsDao'
import { isUndefined } from 'lodash'

const programsDataSource = new ProgramsDataSource()

exports.getPrograms = () => {
  return programsDataSource.getPrograms()
}

exports.getProgramById = programId => {
  return programsDataSource.getProgramById(programId)
}

exports.getFullProgram = programId => {
  const program = programsDataSource.getProgramById(programId)

  // get each workout for the program
  const workouts = program.workouts.map(workout => {
    console.log('-----------------------------------')
    console.log(JSON.stringify(workout))
    let workoutWithSets = getWorkoutById(workout.id)
    console.log(JSON.stringify(workoutWithSets))

    // get the inflated workout sets
    if (!isUndefined(workoutWithSets.sets)) {
      let inflatedSets = workoutWithSets.sets.map(set => {
        let inflatedSet = getSetById(set.id)

        // get the inflated exercises
        let setWithExercises = inflatedSet.exercises.map(exercise => {
          let tempExercise = getExerciseById(exercise.id)
          let fullExercise = { ...exercise, ...tempExercise }
          return fullExercise
        })

        inflatedSet.exercises = [...setWithExercises]

        return inflatedSet
      })

      workoutWithSets.sets = inflatedSets
    }

    return workoutWithSets
  })

  let fullProgram = { ...program }
  fullProgram.workouts = workouts

  return fullProgram
}

exports.addProgram = program => {
  return programsDataSource.addProgram(program)
}

exports.updateProgram = update => {
  return programsDataSource.updateProgram(update)
}
