import express from 'express'
import ExerciseDb from '../data-store/exercise-db'
const router = express.Router()

// router.use(bodyParser.json())
const exerciseDb = new ExerciseDb()

router.get('/', (req, res, next) => {
    const data = exerciseDb.getExercises();
    res.json(data)
})

router.post('/', (req, res, next) => {
    console.log(req.body)
    const data = exerciseDb.addExercises(req.body)
    res.json(req.body)
})

export default router;