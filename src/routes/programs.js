import express from 'express'
import ProgramsDb from '../persistence/local-daos/ProgramsDao'
import { retrieveFullProgram } from '../persistence/fullProgram'

const programsDb = new ProgramsDb()
const router = express.Router()

// gets simple program - not the inflated one
router.get('/', (req, res, next) => {
    const programs = programsDb.getPrograms()
    res.json(programs)
})

router.post('/', (req, res, next) => {
    console.log(req.body)
    const data = programsDb.addPrograms(req.body)
    res.json()
})

// gets full inflated program
router.get('/:id', (req, res, next) => {
    const fullProgram = retrieveFullProgram(req.params.id)
    res.json({fullProgram: fullProgram})
})


export default router;