import express from 'express'
const router = express.Router()
import { getWorkouts, addWorkout, updateWorkout } from '../persistence/dao/WorkoutsDao'

router.get('/', (req, res, next) => {
    const data = getWorkouts()
    res.json(data)
})

router.post('/', (req, res, next) => {
    console.log('/workouts post')
    console.log(req.body)
    const data = addWorkout(req.body)
    res.json(data)
})

router.put('/:id', (req, res, next) => {
    console.log('/workouts put')
    console.log(req.body)
    const data = updateWorkout(req.body)
    res.json(data)
})

export default router;