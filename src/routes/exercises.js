import express from 'express'
import { getExercises, addExercises } from '../data-store/exercise-db'
const router = express.Router()

// router.use(bodyParser.json())

router.get('/', (req, res, next) => {
    const data = getExercises();
    res.json(data)
})

router.post('/', (req, res, next) => {
    console.log(req.body)
    res.json(req.body)
})

export default router;