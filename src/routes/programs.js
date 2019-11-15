import express from 'express'
import { getPrograms, addProgram, getFullProgram } from '../persistence/local-daos/ProgramsDao'

// const programsDao = new ProgramsDao()
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

// gets full inflated program
router.get('/:id', (req, res, next) => {
    const fullProgram = getFullProgram(req.params.id)
    res.json({fullProgram: fullProgram})
})


export default router;