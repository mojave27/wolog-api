import WoDaysDataSource from '../datasources/local/WoDaysDataSource'
const woDaysDataSource = new WoDaysDataSource()
// import validate from 'validate.js'

//TODO: add logger
exports.addWoDay = woday => {
  return woDaysDataSource.addWoDay(woday)
}

exports.getWoDays = () => {
  return woDaysDataSource.getWoDays()
}

exports.getWoDayById = id => {
  return woDaysDataSource.getWoDayById(id)
}

exports.updateWoDay = woday => {
  return woDaysDataSource.updateWoDay(woday)
}

exports.deleteWoDay = id => {
  return woDaysDataSource.deleteWoDay(id)
}
