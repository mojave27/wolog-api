import DbUtils from './DbUtils'
var fs = require('fs')
// import validate from 'validate.js'

// externalize the file/db path to a config or env
const setsDbPath = 'src/data-store/sets.json'

//TODO: add logger
class SetsDao {
  constructor() {
		this.dbUtils = new DbUtils(this.getSets)
  }

  getSets = () => {
    if (fs.existsSync(setsDbPath)) {
      var setsJson = fs.readFileSync(setsDbPath, 'utf8')
      var sets = JSON.parse(setsJson)
      return sets
    } else {
      throw new Error('set db failure.')
    }
  }

  getSetById = id => {
    // TODO: validate the id

    const sets = this.getSets()
    let foundSet = sets.find( set => {
      return set.id == id
    })

    return foundSet
  }

  addSets = (sets) => {
    // console.log(`[set-db] addSets()`)
    if (Array.isArray(sets)) {
      sets.forEach(set => {
        this.addSet(set)
      })
    }
    // validate()
  }

  addSet = (set) => {
    // console.log(`[set-db] addSet()`)
    set.id = this.dbUtils.assignId(set)
    var sets = this.getSets()
    sets.push(set)
    this._updateDb(sets)
  }

  _updateDb = (sets) => {
    this.dbUtils.updateDb(sets, setsDbPath)
  }
}

export default SetsDao
