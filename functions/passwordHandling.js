import bcrypt from 'bcryptjs'
const salt = await bcrypt.genSalt(10);

async function createHashedPassword(password){

    const hashedPassword = await bcrypt.hash(password,salt)

    return hashedPassword;


}

async function isPasswordsMatching(user_password,db_password){

    const validPass = await bcrypt.compare(user_password,db_password)


    return validPass
}

export default {createHashedPassword,isPasswordsMatching}