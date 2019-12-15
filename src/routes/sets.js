import express from 'express'
import { addSet, deleteSet, getSetById, getInflatedSets, updateSet } from '../persistence/dao/SetsDao'
const router = express.Router()


router.get('/', (req, res, next) => {
    const data = getInflatedSets();
    console.log(JSON.stringify(data))
    res.json(data)
})

router.get('/:id', (req, res, next) => {
    const data = getSetById(req.params.id);
    res.json(data)
})

router.post('/', (req, res, next) => {
    console.log('/sets post')
    console.log(req.body)
    const data = addSet(req.body)
    res.json(req.body)
})

router.put('/:id', (req, res, next) => {
    console.log('/sets put')
    console.log(req.body)
    const data = updateSet(req.body)
    res.json(data)
})

router.delete('/:id', (req, res, next) => {
    const isDeleted = deleteSet(req.params.id);
    if( isDeleted ){
        res.status(200).end()
    }else{
        res.status(500).end()
    }
})

export default router;