import dotenv from "dotenv";
dotenv.config()
import jwt from 'jsonwebtoken'

function createJWT(username){

    const token = jwt.sign({ username },process.env.TOKEN_SECRET,{expiresIn:'2d'});

    return { 
                username,
                'auth-token':token
           }

}

function verifyJWT(token){

    try {
        const valid = jwt.verify(token, process.env.TOKEN_SECRET);
        return true
      } 
    catch(err) {
        return false
    }


}

export default {createJWT,verifyJWT}