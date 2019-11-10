const dbUtils = {
  getUniqueIds: function(items) {
    // make an array of the ids
    let ids = Array.from(items, item => item.id)
    ids.sort()
    // ensure unique by converting to Set and back to array :)
    let uniqueIds = Array.from(new Set(ids))
    console.log(uniqueIds)
    return uniqueIds
  },

  generateNewId: function(items) {
    let currentIds = this.getUniqueIds(items)
    var newId = Math.max(...currentIds) + 1
    return newId
  },

  assignId: function(item, items) {
    // if id is invalid, generate one.
    if (typeof item.id === 'undefined' || item.id < 0) {
      return this.generateNewId(items)
    } else if (this.isIdInUse(item.id, items)) {
      return this.generateNewId(items)
    } else {
      return item.id
    }
  },

  isIdInUse: function(id, items) {
    console.log(`[dbUtils]: isIdInUse()`)
    if (typeof id === 'undefined' || id < 0) {
        return false
    } else {
        let ids = this.getUniqueIds(items)
        if(ids.indexOf(id) < 0) {
            return false
        }
    }
    return true
  }

}

export default dbUtils
