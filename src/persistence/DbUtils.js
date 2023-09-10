import { isNaN } from 'lodash'

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
    let newId = this.uuidv4()
    return newId
  }

  uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  assignId = item => {
    // if id is invalid, generate one.
    if (this.validateId(item.id) === false) {
      return this.generateNewId()
    } else if (this.isIdInUse(item.id)) {
      return this.generateNewId()
    } else {
      return item.id
    }
  }

  validateId = id => {
    if (typeof id === 'undefined') return false
    if (id === null) return false
    if (id === '') return false
    if (id < 0) return false
    return true
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
    console.log('updating db with changes')
    fs.writeFileSync(dbPath, JSON.stringify(items), 'utf8', function(err) {
      if (err) throw err
      console.log(`updated ${dbPath}`)
    })
  }
}

export default DbUtils
