var fs = require('fs')
const exerciseDbPath = 'src/data-store/exercises.json'
// import validate from 'validate.js'

module.exports = {
  // returns array of unique, sorted ids
  getUniqueIds: function() {
    const exercises = this.getExercises()
    // make an array of the ids
    var ids = Array.from(exercises, exercise => exercise.id)
    // sort and ensure unique by converting to Set and back to array :)
    let uniqueIds = Array.from(new Set(ids.sort()))
    console.log(uniqueIds)
    return uniqueIds
  },
  getExercises: function() {
    this.getUniqueIds()
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
    if (Array.isArray(exercises)) {
      exercises.forEach(exercise => {
        this.addExercise(exercise)
      })
    }
    // validate()
  },

  addExercise: function(exercise) {
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
    // 		const exercises = this.getExercises()
    // 		const exerciseIds = exercises.map( exercise => exercise.id )
    // 		const exerciseIdsSet = new Set(exerciseIds)
    // 		console.loge
    // 	},
    // if id is invalid, generate one.
    if (typeof item.id === 'undefined' || item.id < 0) {
      return this.generateNewId()
    } else if (this.isIdInUse()) {
      return this.generateNewId()
    } else {
      return item.id
    }
  },

  isIdInUse: function(id) {
    if (typeof item.id === 'undefined' || item.id < 0) {
    }
  },

  generateNewId: function() {
    var exercises = this.getExercises()
    // make an array of the ids
    var ids = Array.from(exercises, exercise => exercise.id)
    ids.sort()
    // ensure unique
    let uniqueIds = new Set(ids)
    // return a new number which isn't in the list
    var newId = highestValue(ids) + 1
    return newId
  },

  // findItemIndex: function(id){
  // 	// var foods = this.getFoodItems();
  // 	const itemIndex = foods.findIndex( food => food.id == id );
  // 	return itemIndex;
  // },

  _writeToFile: function(foods) {
    fs.writeFileSync(
      exerciseDbPath,
      JSON.stringify(exercises),
      'utf8',
      function(err) {
        if (err) throw err
        console.log('updated exercises.json')
      }
    )
    // refresh local foods obj
    foods = JSON.parse(fs.readFileSync(exerciseDbPath, 'utf8'))
  }
}
