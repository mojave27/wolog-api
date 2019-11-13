import express from 'express'
const router = express.Router()
import ProgramsDb from '../data-store/programs-db'
import WorkoutsDb from '../data-store/workouts-db'
const programsDb = new ProgramsDb()
const workoutsDb = new WorkoutsDb()

router.get('/', (req, res, next) => {
    console.log(`queryId: ${req.query.id}`)
    // get program from id
    const program = programsDb.getProgramById(req.query.id)
    console.log(program)

    // get each workout for the program
    const workouts = program.workouts.map(workout => {
        let fullWorkout = workoutsDb.getWorkoutById(workout.id)
        return fullWorkout
    })
    console.log(JSON.stringify(workouts))

    let fullProgram = {...program}
    fullProgram.workouts = workouts
    console.log(JSON.stringify(fullProgram))

    // return the program AND its set of workouts
    res.json({fullProgram: fullProgram})
})

export default router;