import express from 'express'
const router = express.Router()
import database from '../functions/database.js';
import passwordHandling from '../functions/passwordHandling.js';
import authentication from '../functions/authentication.js';


router.post('/login',  async(req,res)=>{
    
    const {username,password} = req.body

    if (!username || !password) {
        res.sendStatus(400)
        return
    }

    try{
        const user = await database.findUser(username)
        if(!user) return res.status(400).send('User not found')

        const validPass = await passwordHandling.isPasswordsMatching(password,user.password)
        if(!validPass) return res.status(400).send('Invalid Password')

        const Token =  authentication.createJWT(user.username)
 
        res.send(Token)
  
    }
    catch(err){
        console.log(err)
        res.send(err.message)
    }
    

}) 


router.post('/register',  async(req,res)=>{
    
    const {username,password} = req.body
    if (!username || !password) {
        res.sendStatus(400)
        return
    }
    
    try{

        const hashedPassword = await passwordHandling.createHashedPassword(password)
        const createUser = await database.createUser(username,hashedPassword)
        res.send({user_id:createUser})

    }
    catch(err){
        console.log(err)
        res.send(err.message)
    }




})




export default router