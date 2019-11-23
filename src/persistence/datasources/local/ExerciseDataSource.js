var fs = require('fs')
import { exerciseDbPath } from '../../../config/local-db-config'
import DbUtils from '../../DbUtils'
// import validate from 'validate.js'

//TODO: add logger
class ExerciseDataSourceLocal {
	constructor() {
		this.dbUtils = new DbUtils(this.getExercises)
	}

  getExercises = () => {
	if (fs.existsSync(exerciseDbPath)) {
	  var exercisesJson = fs.readFileSync(exerciseDbPath, 'utf8')
	  var exercises = JSON.parse(exercisesJson)
	  return exercises
	} else {
	  throw new Error('exercise db failure.')
	}
  }

  getExerciseById = id => {
  	const exercises = this.getExercises()
  	const result = exercises.find( exercise => exercise.id == id );
  	return result;
  }

  addExercise = (exercise) => {
	console.log(`[exercise-db] addExercise()`)
    exercise.id = this.dbUtils.assignId(exercise, this.getExercises())
    var exercises = this.getExercises()
    exercises.push(exercise)
    this._updateDb(exercises)
  }

  _updateDb = (exercises) => {
    this.dbUtils.updateDb(exercises, exerciseDbPath)
  } 

}

export default ExerciseDataSourceLocal
