const express = require('express')
const cors = require('cors')

const app = express()

//config json response
app.use(express.json())

//solve CORS
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

//public folder for images
app.use(express.static('public'))

//routes
const userRoutes = require('./routes/userRoutes')

app.use('/users', userRoutes)

app.listen(5000)