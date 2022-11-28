import dotenv from "dotenv";
dotenv.config()
import { Sequelize,Op } from 'sequelize';
import mysql from 'mysql'
import { faker } from '@faker-js/faker';

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: 'localhost',
    dialect:'mariadb'
});


const Mark = sequelize.define("Mark", {
    result_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    student_id: {
        type: Sequelize.INTEGER,
    },
    student_name: {
      type: Sequelize.STRING,
    },
    subject: {
      type: Sequelize.STRING,
    },
    mark: {
      type: Sequelize.INTEGER,
    },
    grade: {
      type: Sequelize.STRING,
    },
    semester: {
      type: Sequelize.STRING,
    },
    calendar_year: {
      type: Sequelize.INTEGER,
    },

  }, {
    timestamps: false,
    indexes:[
        {
            name: 'student id', //indexing for faster searching through table
            using: 'BTREE',
            fields: [
            'student_id',
            ] 
        }
    ]
    // tableName: 'Users'
  });

  const User = sequelize.define("User", {
    user_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
  }, {
    timestamps: false,
    // tableName: 'Users'
  });

  async function getStudentData(){

    const data = await Mark
    .findAll({
        where: {
        student_id: {
            // [Op.lte]: 20//getting first 20 students
            [Op.between]: [50000, 50019], //includes both //can use any number between 1-100000 with valid logic
        },
        // student_id:50000,
        // subject:'ICT',  
        // calendar_year:2011          // calendar_year:2011
        },
        raw: true,
    })
    return data

  }

  async function findUser(username){

    const data = await User.findOne({ where: { username } });
    return data

  }

  async function createUser(username,password){

    const {user_id} = await User.create({ username,password });
    return user_id

  }

  async function createDatabase(){


    try {
      const connection = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
      })
      connection.connect()
      let sql = `CREATE DATABASE ${process.env.MYSQL_DATABASE}`;
      const result = connection.query(sql);
      return true
    } 
    catch(err) {
        return false
    }

  }

async function createTables(){

  try{
    await User.sync();
    await Mark.sync();
    return true
  }
  catch(err){
    return false
  }

}

async function addTableData(){

  function chunkArray(array, chunkSize) {
    return Array.from(
      { length: Math.ceil(array.length / chunkSize) },
      (_, index) => array.slice(index * chunkSize, (index + 1) * chunkSize)   
    );
  }

  async function uploadData(dataArray) {
    try {
      const chunks = chunkArray(dataArray, 10000); //breaking the 100000 entries into chunks of 10000
      for(const chunk of chunks) {
        await uploadDataChunk(chunk);
      }
    } catch(error) {
      throw error
    }
  }

  async function uploadDataChunk(chunk) {
    try{
        sequelize.models.Mark.bulkCreate(chunk); //10000 entries at once
    }
    catch(err){
      throw error
    }
   
  }

  const subjects = ["ICT","Science","Mathematics","English","Geography"]

  let x=1
    let start=1,end=1000
    const loop = setInterval(()=>{
        if(x==100){ //when 1000*100=100000 students have been added
            clearInterval(loop) //clearing interval after adding 10 mil entries
        }
        let arr = []
        // for 1000 students per iteration
        for (let l = start; l <= end; l++) { 
            let student_name=faker.name.firstName()
            //for 10 years
            for (let i = 1; i <= 10; i++) {

                //for two semesters
                for (let j = 1; j <= 2; j++) {
        
        
                    //for 1 semester 5 subjects
                    for (let k = 1; k <= 5; k++) {
        
                        arr.push({
                            student_id:l,
                            student_name,
                            subject:subjects[k-1],
                            // subject:subjects[j][k-1],
                            grade:i,
                            mark:Math.floor(Math.random() * 101), //random number between 0-100 included
                            semester:j,
                            calendar_year:2010+i, //from 2011-2020
                        })
        
                    }
                    
            
                }
        
            }


           
        }
        uploadData(arr);
        start+=1000
        end+=1000
        x+=1;
    },6000) 
    //waiting 6000 seconds after adding 1000*10*2*5 entries at once.
    //less ram will need more time.(for 16GB)


}



  export default {getStudentData,findUser,createUser,createDatabase,createTables,addTableData}

