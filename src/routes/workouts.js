import express from 'express'
const router = express.Router()
import { addWorkout, deleteWorkout, getWorkouts, getWorkoutById, updateWorkout } from '../persistence/dao/WorkoutsDao'

router.get('/', (req, res, next) => {
    const data = getWorkouts()
    res.json(data)
})

router.get('/:id', (req, res, next) => {
    const data = getWorkoutById(req.params.id)
    res.json(data)
})

router.post('/', (req, res, next) => {
    console.log(`adding workout: ${JSON.stringify(req.body)}`)
    const data = addWorkout(req.body)
    res.json(data)
})

router.put('/:id', (req, res, next) => {
    console.log(`updating workout: ${JSON.stringify(req.body)}`)
    const data = updateWorkout(req.body)
    res.json(data)
})

router.delete('/:id', (req, res, next) => {
    const data = deleteWorkout(req.params.id)
    res.json(data)
})

export default router;