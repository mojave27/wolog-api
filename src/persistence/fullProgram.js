import ProgramsDao from './local-daos/ProgramsDao'
import WorkoutsDao from './local-daos/WorkoutsDao'
import SetsDao from './local-daos/SetsDao'

const programsDao = new ProgramsDao()
const workoutsDao = new WorkoutsDao()
const setsDao = new SetsDao()

export const retrieveFullProgram = programId => {

    const program = programsDao.getProgramById(programId)
    
    console.log(`program workouts: ${JSON.stringify(program.workouts)}`)
    
    // get each workout for the program
    const workouts = program.workouts.map(workout => {
        console.log(`workout: ${JSON.stringify(workout)}`)
        
        let workoutWithSets = workoutsDao.getWorkoutById(workout.id)
        console.log(`workoutWithSets: ${JSON.stringify(workoutWithSets)}`)
        
        // get the workout sets
        let inflatedSets = workoutWithSets.sets.map( set => {
            let inflatedSet = setsDao.getSetById(set.id)
            //inflatedSet: {"id":1,"exercises":[{"id":0,"reps":"6-8-10"}]}
            // get the ex
            let setsWithExercises = inflatedSet.exercises.map( exercise => {
                
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
    return fullProgram
}