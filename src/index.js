import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import adminRouter from './routes/admin'
import exercisesRouter from './routes/exercises'
import programsRouter from './routes/programs'
import setsRouter from './routes/sets'
import trackerRouter from './routes/tracker'
import workoutsRouter from './routes/workouts'

const PORT = process.env.PORT || 3030

const app = express()
app.disable('x-powered-by')

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/', (req, res) => {
    res.json({msg: 'it works!'})
})

app.use('/admin', adminRouter)
app.use('/programs', programsRouter)
app.use('/workouts', workoutsRouter)
// app.use('/program-workouts', programWorkoutsRouter)
app.use('/exercises', exercisesRouter)
app.use('/sets', setsRouter)
app.use('/tracker', trackerRouter)


app.listen(PORT, () => {
    console.log(`express api listening on port ${PORT}`)
})