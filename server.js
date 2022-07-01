const express = require('express')
const mongoose = require('mongoose')
const bookRoutes = require('./routes/bookRoutes')
const { users } = require('./model/usersAndRoles')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config()

const dbUrl = process.env.MONGO_URL || "mongodb://localhost/bookHouse"
mongoose.connect(dbUrl)
const mongoDbConnection = mongoose.connection

mongoDbConnection.on('open', (err) => {
    if (err) console.log("Unable to connect to mongodb\n", err)
    console.log("Connected to database")
})

const app = express()
const PORT = process.env.PORT || 8082

app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(checkUserId)
app.use('/books', bookRoutes)

function checkUserId(req, res, next) {
    const userId = req.body.userId
    if (userId) {
        req.user = users.find(user => user.id === userId)
    }
    next()
}


app.listen(PORT, (err) => {
    if (err) console.log("Error ", err)
    console.log(`Server is up and running on port ${PORT}`)
})