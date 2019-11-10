import express from 'express'
const router = express.Router()

router.get('/', (req, res, next) => {
    res.json(['p1','p2'])
})

export default router;