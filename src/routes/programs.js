import express from 'express'
const router = express.Router()
import ProgramsDb from '../data-store/programs-db'
const programsDb = new ProgramsDb()
import WorkoutsDb from '../data-store/workouts-db'
const workoutsDb = new WorkoutsDb()

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
    // get program from id
    const program = programsDb.getProgramById(req.params.id)

    // get each workout for the program
    const workouts = program.workouts.map(workout => {
        let fullWorkout = workoutsDb.getWorkoutById(workout.id)
        return fullWorkout
    })

    let fullProgram = {...program}
    fullProgram.workouts = workouts

    // return the program AND its set of workouts
    res.json({fullProgram: fullProgram})
})


export default router;