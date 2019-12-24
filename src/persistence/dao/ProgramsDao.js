import ProgramsDataSource from '../datasources/local/ProgramsDataSource'
import { getWorkoutById } from './WorkoutsDao'
import { getInflatedSetById } from './SetsDao'
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

  let workouts = []
  let workoutWithSets = {}

  if (program.workouts) {
    // get each workout for the program
    workouts = program.workouts.map(workout => {
      workoutWithSets = getWorkoutById(workout.id)

      // get the inflated workout sets
      if (!isUndefined(workoutWithSets.sets)) {
        let inflatedSets = workoutWithSets.sets.map(set => {
          return getInflatedSetById(set.id)
        })
        workoutWithSets.sets = inflatedSets
      }
      // }
      return workoutWithSets
    })
  }

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

exports.removeWorkoutFromPrograms = workoutId => {
  return programsDataSource.removeWorkoutFromPrograms(workoutId)
}
