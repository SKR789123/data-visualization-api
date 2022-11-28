import express from 'express'
const router = express.Router()
import verifyToken from '../verifyToken.js'
import database from '../functions/database.js'
import authentication from '../functions/authentication.js';
// import {median,q1} from '../functions/statistical.js' //defined a function to calculate median.But will use a library for that
import {quantile,median} from 'simple-statistics'


router.get('/getstudentdata', verifyToken, async(req,res)=>{
    
        const authenticated = authentication.verifyJWT(req.token)
        
        if(!authenticated) return res.status(403).send('Invalid Token')

        try{

            const {student_id,calendar_year,grade,subject} = req.query

            //adding conditions to an array so only provided filter values will be used

            const filterConditions = []

            if(student_id){
                filterConditions.push((item)=>{
                    return item.student_id==student_id
                })
            }
            if(calendar_year){
                filterConditions.push((item)=>{
                    return item.calendar_year==Number(calendar_year)
                })
            }
            if(grade){
                filterConditions.push((item)=>{
                    return item.grade==grade
                })
            }
            if(subject){
                filterConditions.push((item)=>{
                    return item.subject==subject
                })
            }


            //getting data from db

            const data = await database.getStudentData()
            
        

            const dataToBeFiltered = JSON.parse(JSON.stringify(data))
            

            const filteredMarks = []//array to store marks only
            //applying the filter and pushing marks to filteredmarks array. Can be sorted if required.
            const filteredData = dataToBeFiltered.filter(item=>{

                return filterConditions.every(condition=>condition(item))
                
            }).forEach(item=>{
                filteredMarks.push(item.mark)
            })


            // optional sort

            // filteredMarks.sort((a,b)=>{
            //     return a-b;
            // })
            // console.log(filteredMarks)


    
            //grouping subject marks
            const result = data.reduce((acc,item)=>{
                const itemIndex = acc.findIndex(i=>i.subject === item.subject);//finding if the accumulator has the current item subject
     
                if(itemIndex !== -1){
                    acc[itemIndex].marks=[...acc[itemIndex].marks,item.mark]
                }
                else{
                //   acc.push(item)
                  acc.push({
                      subject:item.subject,
                      marks:[item.mark]
                  })
                }
                return acc;
              },[])
        
            //sorting the marks
    
            const sortedMarks = result.map(item=>{
                return{
                    subject:item.subject,
                    marks:item.marks.sort((a,b)=>{
                        return a-b;
                    })
                }
            })
    
            //finding q1,q2,q3,min,max
            const processedMarks = sortedMarks.map(item=>{
                return{
                    x:item.subject,
                    y:[item.marks[0],quantile(item.marks,0.25),median(item.marks),quantile(item.marks,0.75),item.marks[item.marks.length-1]],
                    y2:filteredMarks
                    // median:median(item.marks),
                    // q1:quantile(item.marks,0.25),
                    // q3:quantile(item.marks,0.75),
                    // min:item.marks[0],
                    // max:item.marks[item.marks.length-1],
                    // marks:median(item.marks)
                }
            })
            res.send(processedMarks)

              
        }
        catch(err){ 
            console.log(err)
             
        }
  


})

router.get('/getstudentprogress', verifyToken, async(req,res)=>{


    const authenticated = authentication.verifyJWT(req.token)
        
    if(!authenticated) return res.status(403).send('Invalid Token')

        try{

            const {student_id} = req.query

            const filterConditions = []

            if(student_id){
                filterConditions.push((item)=>{
                    return item.student_id==student_id
                })
            }

            const data = await database.getStudentData()
    
            //mapping the data to include year_semester property
            const formattedData = data.map(item=>{
                return{
                    student_id:item.student_id,
                    subject:item.subject,
                    mark:item.mark,
                    year_semester:`${item.calendar_year}_${item.semester}`
                }
            })

            //filtering by student id
            const filteredData = formattedData.filter(item=>{

                return filterConditions.every(condition=>condition(item))
                
            })
    
            // console.log(formattedData)

        //grouping by year_semester and accumulating each subject marks in a subject array
        const groupedMarks = filteredData.reduce((acc, { subject, mark, year_semester }) => {
    
            const itemIndex = acc.findIndex(i => i.year_semester === year_semester);
            if (itemIndex === -1) {
                acc.push(
                    { 
                        year_semester, 
                        [subject]: [50] 
                    }
                    );
            } else {
                (acc[itemIndex][subject] ??=[]).push(mark); //will cause an error on node versions before 15.14.0 comment on node versions before 15.14.0
                // (acc[itemIndex][subject] = acc[itemIndex][subject] || []).push(mark); //uncomment and use this on node versions before 15.14.0
            }
            return acc;
        }, []);
    
    
        res.send(groupedMarks)
    
    
    
        }
        catch(err){ 
            console.log(err)
             
        }
  

})



export default router