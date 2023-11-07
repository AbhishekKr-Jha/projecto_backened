const mongoose=require('mongoose')
const { Schema } = mongoose;
 
const Comment_schema=new Schema({
    user:{
        type:String,
        required:[true,"user is required"]
    },
    comment:{
        type:String,
        trim:true,
        required:[true,"Make a comment first"]
    },
    reply:{
        type:String, 
        default:""  ,  
    },
projectId:{
        type:mongoose.Types.ObjectId,
        ref:"ProjectDetail",
        required:[true,"comment id is required"]
     },
    
})

const model=mongoose.model("comment",Comment_schema)
console.log(Object.keys(Comment_schema.obj))
module.exports=model