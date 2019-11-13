import DbUtils from './db-utils'
var fs = require('fs')
// import validate from 'validate.js'

// externalize the file/db path to a config or env
const programsDbPath = 'src/data-store/programs.json'

//TODO: add logger
class ProgramsDb {
  constructor() {
		this.dbUtils = new DbUtils(this.getPrograms)
  }

  getPrograms = () => {
    // console.log(`[program-db] getPrograms()`)
    // console.log(process.cwd())
    // console.log(fs.existsSync('src/data-store/programs.json'))
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

    const programs = this.getPrograms(id)
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

  // /* TODO: externalize management of the array even further
  // *       like you would abstract a database in java, and
  // * 		 use a manager                                   */
  // updatedExercise: function(program){
  // 	// TODO: Add typescript to this project and ensure program is of the correct type.
  // 	program.id = this.assignExerciseId(program)
  // 	// var foods = this.getFoodItems();
  // 	// find the index of the desired item
  // 	var indexOfItemToReplace = this.findItemIndex(foodItem.id)
  // 	console.log(`index of item ${indexOfItemToReplace}`)
  // 	// if index is -1, then no match, and we can just add the item
  // 	if (indexOfItemToReplace == -1){
  // 		foods.push(foodItem)
  // 	}else{
  // 		// if there is a match replace that item with the updated one
  // 		foods.splice(indexOfItemToReplace, 1, foodItem);
  // 	}
  // 	this.updateDb(foods)
  // },

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

export default ProgramsDb
