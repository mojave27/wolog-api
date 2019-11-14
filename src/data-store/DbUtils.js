var fs = require('fs')

class DbUtils {
  constructor(getItems) {
    this.getItems = getItems
  }

  getUniqueIds = () => {
    // make an array of the ids
    let items = this.getItems()
    let ids = Array.from(this.getItems(), item => item.id)
    ids.sort()
    // ensure unique by converting to Set and back to array :)
    let uniqueIds = Array.from(new Set(ids))
    return uniqueIds
  }

  generateNewId = () => {
    let currentIds = this.getUniqueIds()
    var newId = Math.max(...currentIds) + 1
    return newId
  }

  assignId = item => {
    // if id is invalid, generate one.
    if (typeof item.id === 'undefined' || item.id < 0) {
      return this.generateNewId()
    } else if (this.isIdInUse(item.id)) {
      return this.generateNewId()
    } else {
      return item.id
    }
  }

  isIdInUse = id => {
    if (typeof id === 'undefined' || id < 0) {
      return false
    } else {
      let ids = this.getUniqueIds(this.getItems())
      if (ids.indexOf(id) < 0) {
        return false
      }
    }
    return true
  }

  updateDb = (items, dbPath) => {
    fs.writeFileSync(dbPath, JSON.stringify(items), 'utf8', function(err) {
      if (err) throw err
      console.log(`updated ${dbPath}`)
    })
  }
}

export default DbUtils
