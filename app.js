import express from 'express'
import dotenv from "dotenv";
dotenv.config()
// import cors from 'cors'
import authRoute from './routes/auth.js';
import dataRoute from './routes/data.js';
import functionalRoute from './routes/functional.js';

const app = express()

app.use(express.json())
// app.use(
//     cors({
//         origin:'*'
//     })
// )

app.use('/api/auth',authRoute) //register/login
app.use('/api/data',dataRoute) //getdata,getprogressdata
app.use('/api/functional',functionalRoute) //create db,populate large table

export default app 