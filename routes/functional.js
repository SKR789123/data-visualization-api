// creating db and tables
import express from 'express'
const router = express.Router()
import dotenv from "dotenv";
dotenv.config()

import database from '../functions/database.js'



router.get('/createdatabase',  async(req,res)=>{
    
const result = await database.createDatabase()   
if(!result) res.status(500).send('Server Error') 

res.send('Database created')

})

router.get('/createtables',  async(req,res)=>{
    //will create marks table and users table
    const result = await database.createTables()   
    if(!result) res.status(500).send('Server Error') 
     
    res.send('Tables created')
    
})

router.get('/populatemarks',  async(req,res)=>{
    
    const result =  database.addTableData()  

    res.send('Data population started please wait. This will take some time')
    
})








export default router