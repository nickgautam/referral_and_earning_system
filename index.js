const express = require("express")
const mongoose = require("mongoose")
const socketIo = require("socket.io")
const http = require("http")
const path = require("path")
const multer = require("multer")
require("dotenv").config()
const app = express()
const user_routes = require("./routes/user")
const purchase_routes = require("./routes/purchase")
require("./helper/globalHelper")
app.use(express.static(path.resolve("./public")))
app.use(multer().any())
app.use(express.json())

let url = process.env.MONGO_CLUSTER_STRING

mongoose.connect(url, { useNewUrlParser: true })
    .then(() => console.log(`Mongo database connected successfully`))
    .catch((err) => console.log(`Error in connecting mongo database. Error: ${err}`))

app.use("", user_routes)
app.use("", purchase_routes)

let server = http.createServer(app)
let io = socketIo(server)

server.listen(process.env.PORT ? process.env.PORT : 4100, () => {
    console.log(`Server is running on PORT: ${process.env.PORT ? process.env.PORT : 4100}`)
})
