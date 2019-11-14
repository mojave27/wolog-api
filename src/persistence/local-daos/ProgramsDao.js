import DbUtils from '../DbUtils'
var fs = require('fs')
import { programsDbPath } from '../../config/local-db-config'
// import validate from 'validate.js'

//TODO: add logger
class ProgramsDao {
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

  // returns array of unique, sorted ids
  getUniqueIds = () => {
    // console.log(`[program-db] getUniqueIds()`)
    const programs = this.getPrograms()
    // make an array of the ids
    let ids = Array.from(programs, program => program.id)
    // sort and ensure unique by converting to Set and back to array :)
    let uniqueIds = Array.from(new Set(ids.sort()))
    // console.log(uniqueIds)
    return uniqueIds
  }

  addPrograms = (programs) => {
    // console.log(`[program-db] addPrograms()`)
    if (Array.isArray(programs)) {
      programs.forEach(program => {
        this.addProgram(program)
      })
    }
    // validate()
  }

  addProgram = (program) => {
    // console.log(`[program-db] addProgram()`)
    program.id = this.dbUtils.assignId(program)
    var programs = this.getPrograms()
    programs.push(program)
    this._updateDb(programs)
  }

  assignId = (item) => {
    // console.log(`[program-db]: assignId()`)
    // if id is invalid, generate one.
    if (typeof item.id === 'undefined' || item.id < 0) {
      return this.generateNewId()
    } else if (this.isIdInUse(item.id)) {
      return this.generateNewId()
    } else {
      return item.id
    }
  }

  _updateDb = (programs) => {
    this.dbUtils.updateDb(programs, programsDbPath)
  }
}

export default ProgramsDao
