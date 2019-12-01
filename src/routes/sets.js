import express from 'express'
import { getSets, addSet } from '../persistence/dao/SetsDao'
const router = express.Router()


router.get('/', (req, res, next) => {
    const data = getSets();
    res.json(data)
})

router.post('/', (req, res, next) => {
    console.log('/sets post')
    console.log(req.body)
    const data = addSet(req.body)
    res.json(req.body)
})

export default router;