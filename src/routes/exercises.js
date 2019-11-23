import express from 'express'
import { getExercises, addExercise } from '../persistence/dao/ExerciseDao'
const router = express.Router()


router.get('/', (req, res, next) => {
    const data = getExercises();
    res.json(data)
})

router.post('/', (req, res, next) => {
    console.log(req.body)
    const data = addExercises(req.body)
    res.json(req.body)
})

export default router;