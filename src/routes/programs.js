import express from 'express'
import ProgramsDb from '../data-store/ProgramsDao'
import WorkoutsDb from '../data-store/WorkoutsDao'
import SetsDao from '../data-store/SetsDao'

const programsDb = new ProgramsDb()
const workoutsDb = new WorkoutsDb()
const setsDao = new SetsDao()
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
    // get program from id
    const program = programsDb.getProgramById(req.params.id)

    console.log(`program workouts: ${JSON.stringify(program.workouts)}`)

    // get each workout for the program
    const workouts = program.workouts.map(workout => {
        console.log(`workout: ${JSON.stringify(workout)}`)

        let workoutWithSets = workoutsDb.getWorkoutById(workout.id)
        console.log(`workoutWithSets: ${JSON.stringify(workoutWithSets)}`)
        
        // get the workout sets
        let inflatedSets = workoutWithSets.sets.map( set => {
            let inflatedSet = setsDao.getSetById(set.id)
            //inflatedSet: {"id":1,"exercises":[{"id":0,"reps":"6-8-10"}]}
        // get the ex
            let setsWithExercises = sets.exercises.map( exercise => {

            })
            console.log(`set: ${JSON.stringify(set)}`)
            console.log(`inflatedSet: ${JSON.stringify(inflatedSet)}`)
            // console.log(JSON.stringify(sets))
        })

        // return fullWorkout
        return workoutWithSets
    })

    let fullProgram = {...program}
    fullProgram.workouts = workouts

    // return the program AND its set of workouts
    res.json({fullProgram: fullProgram})
})


export default router;