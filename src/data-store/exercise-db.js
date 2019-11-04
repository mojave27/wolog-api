var fs = require('fs')
const exerciseDbPath = 'src/data-store/exercises.json'
// import validate from 'validate.js'

//TODO: add logger
const exerciseDb = {
  getExercises: function() {
	console.log(`[exercise-db] getExercises()`)
	// console.log(process.cwd())
	// console.log(fs.existsSync('src/data-store/exercises.json'))
	if (fs.existsSync(exerciseDbPath)) {
	  var exercisesJson = fs.readFileSync(exerciseDbPath, 'utf8')
	  var exercises = JSON.parse(exercisesJson)
	  return exercises
	} else {
	  throw new Error('exercise db failure.')
	}
  },

  // returns array of unique, sorted ids
  getUniqueIds: function() {
	console.log(`[exercise-db] getUniqueIds()`)
    const exercises = this.getExercises()
    // make an array of the ids
    var ids = Array.from(exercises, exercise => exercise.id)
    // sort and ensure unique by converting to Set and back to array :)
    let uniqueIds = Array.from(new Set(ids.sort()))
    console.log(uniqueIds)
    return uniqueIds
  },

  // getExerciseById: function(id){
  // 	const exercises = getExercises()
  // 	const result = exercises.find( exercise => exercise.id == id );
  // 	return result;
  // },

  // updateExerciseItems: function(newExercises){
  // 	newExercises.forEach( updatedExerciseItem => {
  // 		this.putExerciseItem(updatedExerciseItem);
  // 	})
  // },

  addExercises: function(exercises) {
	console.log(`[exercise-db] addExercises()`)
    if (Array.isArray(exercises)) {
      exercises.forEach(exercise => {
        this.addExercise(exercise)
      })
    }
    // validate()
  },

  addExercise: function(exercise) {
	console.log(`[exercise-db] addExercise()`)
    exercise.id = this.assignId(exercise)
    var exercises = this.getExercises()
    exercises.push(exercise)
    this._writeToFile(exercises)
  },

  // /* TODO: externalize management of the array even further
  // *       like you would abstract a database in java, and
  // * 		 use a manager                                   */
  // updatedExercise: function(exercise){
  // 	// TODO: Add typescript to this project and ensure exercise is of the correct type.
  // 	exercise.id = this.assignExerciseId(exercise)
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
	  console.log(`[exercise-db]: assignId()`)
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
	console.log(`[exercise-db]: isIdInUse()`)
    if (typeof id === 'undefined' || id < 0) {
    }
  },

  generateNewId: function() {
	console.log(`[exercise-db]: generateNewId()`)
    var exercises = this.getExercises()
    // make an array of the ids
    var ids = Array.from(exercises, exercise => exercise.id)
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

  _writeToFile: function(exercises) {
	console.log(`[exercise-db]: _writeToFile()`)
    fs.writeFileSync(
      exerciseDbPath,
      JSON.stringify(exercises),
      'utf8',
      function(err) {
        if (err) throw err
        console.log('updated exercises.json')
      }
    )
  }

}

export default exerciseDb
