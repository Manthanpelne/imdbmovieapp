const express = require("express")
const cors = require("cors")
const app = express();
const {connection} = require("./db");
const {userRouter} = require("./routes/userroute")
const {movieRouter} = require("./routes/movieroute")

const {authenticate} = require("./middlewares/authenticate")
const {authorize} = require("./middlewares/authorize")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

require('dotenv').config()

// const redis = require("redis")
// const client=redis.createClient()


// client.on("error",(err)=>console.log("Redis client error"))
// client.connect()


app.use(cors());

app.use(express.json())


app.use("/user",userRouter)
app.use("/movie",movieRouter)



app.listen(process.env.port,async()=>{
try {
    await connection
    console.log(`running at server ${process.env.port}`)
} catch (error) {
    console.log(error)
}
})