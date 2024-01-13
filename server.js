const express = require("express");
const route= require("./Route/routes")
const ip= require("ip");
const dotenv = require("dotenv")
const logger = require("./log/logger")
const app = express();

//
dotenv.config();

//env varaiable define
const PORT = process.env.SERVER_PORT || 4001;

//Middleware
//json body
app.use(express.json());






app.get("/",(req,res)=>
{
    res.send("server iniziated");
})


app.use("/api",route)


app.listen(PORT,()=>
{
    logger.info(`Server Started on ${ip.address()}:${PORT}`)
})