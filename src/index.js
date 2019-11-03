import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

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


app.listen(PORT, () => {
    console.log(`express api listening on port ${PORT}`)
})