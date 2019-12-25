import express from 'express'
import { getPrograms, addProgram, getFullProgram, updateProgram } from '../persistence/dao/ProgramsDao'

const router = express.Router()


// gets simple program - not the inflated one
router.get('/', (req, res, next) => {
    const programs = getPrograms()
    res.json(programs)
})

router.post('/', (req, res, next) => {
    const data = addProgram(req.body)
    res.json(data)
})

router.put('/:id', (req, res, next) => {
    console.log('/programs put')
    // if the program in the body has an id, overwrite it with the one requested on the url.
    let update = {...req.body, id: req.params.id }
    const data = updateProgram(update)
    res.json(data)
})

// gets full inflated program
router.get('/:id', (req, res, next) => {
    const fullProgram = getFullProgram(req.params.id)
    res.json({fullProgram: fullProgram})
})


export default router;