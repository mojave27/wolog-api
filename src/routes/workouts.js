import express from 'express'
const router = express.Router()

router.get('/', (req, res, next) => {
    res.json({msg: 'stub for workouts'})
})

export default router;