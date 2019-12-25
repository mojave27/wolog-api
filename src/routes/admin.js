import express from 'express'
import { getSets } from '../persistence/dao/SetsDao'
import { getExercises } from '../persistence/dao/ExerciseDao'
import { getPrograms } from '../persistence/dao/ProgramsDao'
import { getWorkouts } from '../persistence/dao/WorkoutsDao'
const router = express.Router()

//TODO: add authn/authz
router.get('/consistency-check', (req, res, next) => {
    let data = consistencyCheck()
    res.json(data).status(200)
})

router.get('/', (req, res, next) => {
    res.send('success!')
})


const consistencyCheck = () => {
    let response = {}
    // let programWorkoutInconsistencies = checkProgramWorkouts() 
    let programInconsistencies = checkDataInconsistencies(getWorkoutIds, getPrograms, 'workouts')
    response.programs = programInconsistencies

    let setInconsistencies = checkDataInconsistencies(getExerciseIds, getSets, 'exercises')
    response.sets = setInconsistencies

    return response
}

const getExerciseIds = () => {
    let exerciseIds = getExercises().map( exercise => exercise.id)
    return exerciseIds
}

const getWorkoutIds = () => {
    let workoutIds = getWorkouts().map( workout => workout.id)
    return workoutIds
}

// call with checkDataInconsistencies(getExerciseIds(), getSets(), 'exercises')
const checkDataInconsistencies = (getValidIds, getTargetData, targetList) => {
    let validIds = getValidIds()
    let inconsistencies = []
    getTargetData().forEach( dataObject => {
        let badItems = [] 
        dataObject[targetList].forEach( item => {
            console.log(`item: ${JSON.stringify(item)}`)
            let index = validIds.findIndex( id => Number(id) === Number(item.id))
            if (index < 0) { badItems.push(item.id) }
        })
        if(badItems.length > 0){
            inconsistencies.push({ id: dataObject.id, badItems: badItems })
        }
    })
    return inconsistencies
}


export default router;