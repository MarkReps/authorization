require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const errorMiddleware=require("./middlewares/errorMiddleware.js")
const router = require("./Router/index.js")

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cors({
    credentials:true,
    origin: process.env.CLIENT_URL
}))
app.use(cookieParser())
app.use("/api",router)
app.use(errorMiddleware)


const start = async () =>{
    try {
        await mongoose.connect(process.env.DB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        app.listen(PORT, () => {console.log(`Server is working on Port ${PORT}`)})
    } catch (error) {
        console.log(error)
    }
}

start()