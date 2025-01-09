const express = require("express")
const mongoose = require("mongoose")
const { Server } = require("socket.io")
const http = require("http")
const multer = require("multer")
require("dotenv").config()
const app = express()
const user_routes = require("./routes/user_route")
const purchase_routes = require("./routes/purchase_route")
const earning_routes = require("./routes/earning_route")
require("./helper/globalHelper")

const expressLayouts = require("express-ejs-layouts");

app.use(express.static("public"));

app.use(expressLayouts);

app.set("layout", "./layouts/auth_layout");

app.set("view engine", "ejs");

app.use(multer().any())
app.use(express.json())

let url = process.env.MONGO_CLUSTER_STRING

mongoose.connect(url, { useNewUrlParser: true })
    .then(() => console.log(`Mongo database connected successfully`))
    .catch((err) => console.log(`Error in connecting mongo database. Error: ${err}`))

app.use("", user_routes)
app.use("", purchase_routes)
app.use("", earning_routes)

let server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    // console.log('A new user has connected', socket.id);
    // socket.on("user-message", (message)=>{
    //     console.log(message,"message")
    //     io.emit("message", message)
    // })
});

server.listen(process.env.PORT ? process.env.PORT : 4100, () => {
    console.log(`Server is running on PORT: ${process.env.PORT ? process.env.PORT : 4100}`)
})

module.exports = { io }