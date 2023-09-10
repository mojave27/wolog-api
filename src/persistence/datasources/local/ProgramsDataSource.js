import DbUtils from '../../DbUtils'
var fs = require('fs')
import { programsDbPath } from '../../../config/local-db-config'
import Logger from '../../../logging/Logger'
// import validate from 'validate.js'

const log = new Logger('ProgramsDataSource')

//TODO: add logger
class ProgramsDataSourceLocal {
  constructor() {
    this.dbUtils = new DbUtils(this.getPrograms)
  }

  getPrograms = () => {
    log.info(`getting programs`)
    if (fs.existsSync(programsDbPath)) {
      var programsJson = fs.readFileSync(programsDbPath, 'utf8')
      var programs = JSON.parse(programsJson)
      return programs
    } else {
      throw new Error('program db failure.')
    }
  }

  getProgramById = id => {
    log.info(`getting program with id ${id}`)
    // TODO: validate the id
    const programs = this.getPrograms()
    let foundProgram = programs.find(program => {
      return program.id == id
    })

    return foundProgram
  }

  addProgram = program => {
    if (program.id){
      log.info(`program with id ${program.id} already exists, not adding.`)
      return this.updateProgram(program)
    }
    log.info(`adding new program ${JSON.stringify(program)}`)
    program.id = this.dbUtils.assignId(program)
    var programs = this.getPrograms()
    programs.push(program)
    this._updateDb(programs)
    return program
  }

  updateProgram = update => {
    log.info(`updating existing program with id ${update.id}`)
    log.info(`  program is: ${JSON.stringify(update)}`)
    let programs = this.getPrograms()
    let index = programs.findIndex(program => {
      // return Number(program.id) === Number(update.id)
      return program.id === update.id
    })
    let currentProgram = { ...programs[index] }
    let merged = { ...currentProgram, ...update }
    programs[index] = merged
    this._updateDb(programs)
    log.info(`  updated programs with: ${JSON.stringify(merged)}`)
    return merged
  }

  removeWorkoutFromPrograms = workoutId => {
    let programs = this.getPrograms()
    let cleanedPrograms = programs.map( program => {
      let programWorkouts = [...program.workouts]
      let index = programWorkouts.findIndex( programWorkout => Number(programWorkout.id) === Number(workoutId))
      if( index >= 0) {
        log.info(`removing workout with id ${workoutId} from program with id ${program.id}`)
        programWorkouts.splice(index, 1)  
      }
      program.workouts = programWorkouts
      return program
    })
    this._updateDb(cleanedPrograms)
  }

  _updateDb = programs => {
    this.dbUtils.updateDb(programs, programsDbPath)
  }
}

export default ProgramsDataSourceLocal
