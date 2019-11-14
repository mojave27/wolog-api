var fs = require('fs')
const exerciseDbPath = 'src/data-store/exercises.json'
import DbUtils from './DbUtils'
// import validate from 'validate.js'

//TODO: add logger
class ExerciseDb {
	constructor() {
		this.dbUtils = new DbUtils(this.getExercises)
	}

  getExercises = () => {
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
  }

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

  addExercises = (exercises) => {
	console.log(`[exercise-db] addExercises()`)
    if (Array.isArray(exercises)) {
      exercises.forEach(exercise => {
        this.addExercise(exercise)
      })
    }
    // validate()
  }

  addExercise = (exercise) => {
	console.log(`[exercise-db] addExercise()`)
    exercise.id = this.dbUtils.assignId(exercise, this.getExercises())
    var exercises = this.getExercises()
    exercises.push(exercise)
    this._updateDb(exercises)
  }

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
  // 	this._updateDb(foods)
  // },


  // findItemIndex: function(id){
  // 	// var foods = this.getFoodItems();
  // 	const itemIndex = foods.findIndex( food => food.id == id );
  // 	return itemIndex;
  // },

  _updateDb = (exercises) => {
    this.dbUtils.updateDb(exercises, exerciseDbPath)
  } 

}

export default ExerciseDb
