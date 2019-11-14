import express from 'express'
const router = express.Router()
import ProgramsDao from '../persistence/ProgramsDao'
import WorkoutsDao from '../persistence/WorkoutsDao'
const programsDao = new ProgramsDao()
const workoutsDao = new WorkoutsDao()

router.get('/', (req, res, next) => {
    console.log(`queryId: ${req.query.id}`)
    // get program from id
    const program = programsDao.getProgramById(req.query.id)
    console.log(program)

    // get each workout for the program
    const workouts = program.workouts.map(workout => {
        let fullWorkout = workoutsDao.getWorkoutById(workout.id)
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