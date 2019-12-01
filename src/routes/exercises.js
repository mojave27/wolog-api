import express from 'express'
import { addExercise, deleteExerciseById, getExercises } from '../persistence/dao/ExerciseDao'
const router = express.Router()


router.get('/', (req, res, next) => {
    const data = getExercises();
    res.json(data)
})

router.post('/', (req, res, next) => {
    console.log(req.body)
    const data = addExercise(req.body)
    res.json(req.body)
})

router.delete('/:id', (req, res, next) => {
    console.log(req.params.id)
    try {
        deleteExerciseById(req.params.id)
        res.json({ message: `exercise with id ${req.params.id} successfully deleted.`}).status(200)
    } catch (error) {
        res.json({ error: error}).status(404)
    }
})

export default router;