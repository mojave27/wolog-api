// import validate from 'validate.js'
import SetsDataSource from '../datasources/local/SetsDataSource'
import { removeSetFromWorkouts } from '../dao/WorkoutsDao'
const setsDataSource = new SetsDataSource()

//TODO: add logger

exports.getSets = () => {
  return setsDataSource.getSets()
}

exports.getInflatedSets = () => {
  return setsDataSource.getInflatedSets()
}

exports.getSetById = id => {
  return setsDataSource.getSetById(id)
}

exports.getInflatedSetById = id => {
  return setsDataSource.getInflatedSetById(id)
}

exports.addSet = set => {
  return setsDataSource.addSet(set)
}

exports.updateSet = set => {
  return setsDataSource.updateSet(set)
}

exports.deleteSet = id => {
  /*
   * also remove set from any workouts
   */
  console.log(`deleting set with id ${id}`)
  removeSetFromWorkouts(id)
  return setsDataSource.deleteSet(id)
}
