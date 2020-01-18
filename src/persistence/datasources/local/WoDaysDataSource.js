import DbUtils from '../../DbUtils'
var fs = require('fs')
import { woDaysDbPath } from '../../../config/local-db-config'
import { isUndefined } from 'lodash'
import Logger from '../../../logging/Logger'

// import validate from 'validate.js'
const log = new Logger('WoDaysDataSource')

//TODO: add logger
class WoDaysDao {
  constructor() {
    this.dbUtils = new DbUtils(this.getWoDays)
  }

  getWoDays = () => {
    // console.log(`getting wodays`)
    log.info(`getting wodays`)
    if (fs.existsSync(woDaysDbPath)) {
      let woDaysJson = fs.readFileSync(woDaysDbPath, 'utf8')
      let wodays = JSON.parse(woDaysJson)
      return wodays
    } else {
      throw new Error('wodays db failure.')
    }
  }


  getWoDayById = id => {
    log.info(`getting woday with id ${id}`)
    // TODO: validate the id
    const woDays = this.getWoDays()
    let foundWoDay = woDays.find(woDay => {
      return woDay.id == id
    })
    //TODO: handle error if woday not found
    if (isUndefined(foundWoDay)) {
      throw new Error('no woday found with id: ' + id)
    }
    log.info(`found woDay: ${JSON.stringify(foundWoDay)}`)

    return foundWoDay
  }


  addWoDays = wodays => {
    log.info(`adding wodays`)
    if (Array.isArray(wodays)) {
      wodays.forEach(woday => {
        this.addWoDay(woday)
      })
    }
    // validate()
  }

  addWoDay = woday => {
    if (woday.id) {
      // TODO: do a real lookup of the id to verify whether it exists.
      log(NAME,`woday already has an id ${workout.id}, will not add.`)
      return woday
    }
    log.info(`adding new woday ${JSON.stringify(woday)}`)
    woday.id = this.dbUtils.assignId(woday)
    log.info(`  assigning id ${woday.id} to woday.`)
    var wodays = this.getWoDays()
    wodays.push(woday)
    this._updateDb(wodays)
    log.info(`  added new woday ${JSON.stringify(woday)}`)
    return woday
  }

  updateWoDay = update => {
    log.info(`updating existing woday with id ${update.id}`)
    let wodays = this.getWodays()
    let index = wodays.findIndex(woday => {
      return Number(woday.id) === Number(update.id)
    })
    let currentWoday = { ...wodays[index] }
    let merged = { ...currentWoday, ...update }
    wodays[index] = merged
    this._updateDb(wodays)
    return merged
  }

  deleteWoday = id => {
    log.info(`deleting existing woday with id ${id}`)
    // TODO: validate the id
    let wodays = this.getWoDays()
    let index = wodays.findIndex(woday => {
      return Number(woday.id) === Number(id)
    })
    log.info(`found index ${index} for woday id ${id}`)
    let deletedWoday = wodays.splice(index, 1)
    this._updateDb(wodays)
    log.info(`deleted woday with id ${deletedWoday.id}`)
    return deletedWoday
  }


  _updateDb = wodays => {
    this.dbUtils.updateDb(wodays, woDaysDbPath)
  }
}

export default WoDaysDao
