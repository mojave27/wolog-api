import express from 'express'
import { addSet, deleteSet, getSetById, getInflatedSets, getInflatedSetById, updateSet } from '../persistence/dao/SetsDao'
const router = express.Router()

router.get('/', (req, res, next) => {
    const data = getInflatedSets();
    // console.log(JSON.stringify(data))
    res.json(data)
})

router.get('/:id', (req, res, next) => {
    const data = getInflatedSetById(req.params.id);
    res.json(data)
})

router.post('/', (req, res, next) => {
    // console.log(`/sets post with ${JSON.stringify(req.body)}`)
    const {id} = addSet(req.body)
    let newSet = getInflatedSetById(id)
    res.json(newSet)
})

router.put('/:id', (req, res, next) => {
    // console.log(`/sets put with ${JSON.stringify(req.body)}`)
    const data = updateSet(req.body)
    res.json(data)
})

router.delete('/:id', (req, res, next) => {
    const data = deleteSet(req.params.id);
    res.json(data)
})

export default router;