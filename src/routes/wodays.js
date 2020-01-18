import express from 'express'
const router = express.Router()
import { addWoDay, deleteWoDay, getWoDays, getWoDayById, updateWoDay } from '../persistence/dao/WoDaysDao'

router.get('/', (req, res, next) => {
    console.log('getting wo days.')
    const data = getWoDays()
    res.json(data)
})

router.get('/:id', (req, res, next) => {
    console.log(`getting wo day with id ${req.params.id}.`)
    const data = getWoDayById(req.params.id)
    res.json(data)
})

router.post('/', (req, res, next) => {
    console.log(`adding woday: ${JSON.stringify(req.body)}`)
    const data = addWoDay(req.body)
    res.json(data)
})

router.put('/:id', (req, res, next) => {
    console.log(`updating woday: ${JSON.stringify(req.body)}`)
    const data = updateWoDay(req.body)
    res.json(data)
})

router.delete('/:id', (req, res, next) => {
    const data = deleteWoDay(req.params.id)
    res.json(data)
})

export default router;