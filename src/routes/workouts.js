import express from 'express'
const router = express.Router()
import { getWorkouts, addWorkout } from '../persistence/dao/WorkoutsDao'

router.get('/', (req, res, next) => {
    const data = getWorkouts()
    res.json({msg: 'stub for workouts'})
})

export default router;