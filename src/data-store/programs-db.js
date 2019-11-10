var fs = require('fs')
// externalize the file/db path to a config or env
const programsDbPath = 'src/data-store/programs.json'
// import validate from 'validate.js'

//TODO: add logger
const programsDb = {
  getExercises: function() {
    console.log(`[program-db] getExercises()`)
    // console.log(process.cwd())
    // console.log(fs.existsSync('src/data-store/programs.json'))
    if (fs.existsSync(programDbPath)) {
      var programsJson = fs.readFileSync(programsDbPath, 'utf8')
      var programs = JSON.parse(programsJson)
      return programs
    } else {
      throw new Error('program db failure.')
    }
  },

  // returns array of unique, sorted ids
  getUniqueIds: function() {
    console.log(`[program-db] getUniqueIds()`)
    const programs = this.getExercises()
    // make an array of the ids
    let ids = Array.from(programs, program => program.id)
    // sort and ensure unique by converting to Set and back to array :)
    let uniqueIds = Array.from(new Set(ids.sort()))
    console.log(uniqueIds)
    return uniqueIds
  },

  // getExerciseById: function(id){
  // 	const programs = getExercises()
  // 	const result = programs.find( program => program.id == id );
  // 	return result;
  // },

  // updateExerciseItems: function(newExercises){
  // 	newExercises.forEach( updatedExerciseItem => {
  // 		this.putExerciseItem(updatedExerciseItem);
  // 	})
  // },

  addExercises: function(programs) {
    console.log(`[program-db] addExercises()`)
    if (Array.isArray(programs)) {
      programs.forEach(program => {
        this.addExercise(program)
      })
    }
    // validate()
  },

  addExercise: function(program) {
    console.log(`[program-db] addExercise()`)
    program.id = this.assignId(program)
    var programs = this.getExercises()
    programs.push(program)
    this._writeToFile(programs)
  },

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
  // 	this._writeToFile(foods)
  // },

  assignId: function(item) {
    console.log(`[program-db]: assignId()`)
    // if id is invalid, generate one.
    if (typeof item.id === 'undefined' || item.id < 0) {
      return this.generateNewId()
    } else if (this.isIdInUse(item.id)) {
      return this.generateNewId()
    } else {
      return item.id
    }
  },

  isIdInUse: function(id) {
    console.log(`[program-db]: isIdInUse()`)
    if (typeof id === 'undefined' || id < 0) {
    }
  },

  generateNewId: function() {
    console.log(`[program-db]: generateNewId()`)
    var programs = this.getExercises()
    // make an array of the ids
    var ids = Array.from(programs, program => program.id)
    ids.sort()
    // ensure unique
    let uniqueIds = new Set(ids)
    // return a new number which isn't in the list
    var newId = Math.max(...ids) + 1
    return newId
  },

  // findItemIndex: function(id){
  // 	// var foods = this.getFoodItems();
  // 	const itemIndex = foods.findIndex( food => food.id == id );
  // 	return itemIndex;
  // },

  _writeToFile: function(programs) {
    console.log(`[program-db]: _writeToFile()`)
    fs.writeFileSync(programsDbPath, JSON.stringify(programs), 'utf8', function(
      err
    ) {
      if (err) throw err
      console.log('updated programs.json')
    })
  }
}

export default programsDb
