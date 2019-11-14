import express from 'express'
import ExerciseDao from '../persistence/local-daos/ExerciseDao'
const router = express.Router()

// router.use(bodyParser.json())
const exerciseDao = new ExerciseDao()

router.get('/', (req, res, next) => {
    const data = exerciseDao.getExercises();
    res.json(data)
})

router.post('/', (req, res, next) => {
    console.log(req.body)
    const data = exerciseDao.addExercises(req.body)
    res.json(req.body)
})

export default router;