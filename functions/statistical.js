export const median = (marks) =>{
    
    if(!marks) throw new Error("No marks found");
    if(marks.length ===0) throw new Error("No marks found");
    marks = [...marks]
    const marksLengthHalf = Math.floor(marks.length/2)

    if(marks.length % 2){ //not divisible by 2

        return marks[marksLengthHalf]
    }
    const medianValue = (marks[marksLengthHalf-1]+marks[marksLengthHalf])/2
    return medianValue
 
}

// will not be using this. instead will use a library that will provide the quantiles also.
