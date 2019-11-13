import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import programsRouter from './routes/programs'
import workoutsRouter from './routes/workouts'
// import programWorkoutsRouter from './routes/workoutsByProgram'
import exercisesRouter from './routes/exercises'

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

app.use('/programs', programsRouter)
app.use('/workouts', workoutsRouter)
// app.use('/program-workouts', programWorkoutsRouter)
app.use('/exercises', exercisesRouter)


app.listen(PORT, () => {
    console.log(`express api listening on port ${PORT}`)
})