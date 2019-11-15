import DbUtils from '../DbUtils'
var fs = require('fs')
import { programsDbPath } from '../../config/local-db-config'
// import validate from 'validate.js'

//TODO: add logger
class ProgramsDataSourceLocal {
  constructor() {
		this.dbUtils = new DbUtils(this.getPrograms)
  }

  getPrograms = () => {
    if (fs.existsSync(programsDbPath)) {
      var programsJson = fs.readFileSync(programsDbPath, 'utf8')
      var programs = JSON.parse(programsJson)
      return programs
    } else {
      throw new Error('program db failure.')
    }
  }

  getProgramById = id => {
    // console.log(`getProgramById ${id}`)
    // TODO: validate the id
    const programs = this.getPrograms()
    let foundProgram = programs.find( program => {
      return program.id == id
    })

    return foundProgram
  }

  // addPrograms = (programs) => {
  //   // console.log(`[program-db] addPrograms()`)
  //   if (Array.isArray(programs)) {
  //     programs.forEach(program => {
  //       this.addProgram(program)
  //     })
  //   }
  //   // validate()
  // }

  addProgram = (program) => {
    // console.log(`[program-db] addProgram()`)
    program.id = this.dbUtils.assignId(program)
    var programs = this.getPrograms()
    programs.push(program)
    this._updateDb(programs)
  }

  _updateDb = (programs) => {
    this.dbUtils.updateDb(programs, programsDbPath)
  }
}

export default ProgramsDataSourceLocal
