const mongoose=require('mongoose')
const { Schema } = mongoose;
const validator=require('validator')

const Project_schema=new Schema({
    title:{  
        type:String,
        required:[true,"Title is required"],
        trim:true,
      },
     live:{
        type:String,
        validate(value){
            if(!validator.isURL(value)){throw new Error("Live link - Not a valid URL")}
        },
        trim:true,
    },
    github:{
        type:String,
        validate(value){
            if(!validator.isURL(value)){throw new Error("Github - Not a valid URL")}
        },
        trim:true,
    },
    description:{
        type:String,
        required:[true,"Project Description is required"],
        trim:true,
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:"userDetail",
        required:[true,"user id is required"]
    },
    comments:[{
        type:mongoose.Types.ObjectId,
        ref:"comment"
    }]
},{timestamps:true})


const model=mongoose.model("ProjectDetail",Project_schema)
module.exports=model