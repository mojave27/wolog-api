// import validate from 'validate.js'
import SetsDataSource from '../datasources/local/SetsDataSource'
const setsDataSource = new SetsDataSource()

//TODO: add logger

exports.getSets = () => {
  return setsDataSource.getSets()
}

exports.getSetById = id => {
  return setsDataSource.getSetById(id)
}

exports.addSet = set => {
  return setsDataSource.addSet(set)
}
