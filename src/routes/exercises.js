import express from 'express'
import exerciseDb from '../data-store/exercise-db'
const router = express.Router()

// router.use(bodyParser.json())

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