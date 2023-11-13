const mongoose=require('mongoose')
const validator=require('validator')
const { Schema } = mongoose;

const schema = new Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
     },
     lastName:{
       type:String,
       required:true,
       trim:true,
    },
     email:{
        type:String,
        required:true,
        unique:[true,"Email already present"],
        trim:true,
        validate(value){
         if(!validator.isEmail(value)){throw new Error("Not a valid email")}
        }
     },
     contact:[{
      type:String,
     }],
     projects:[{
type:mongoose.Types.ObjectId,
ref:"ProjectDetail",
     }],
     pw:{
        type:String,
        required:true,
        trim:true,
      //   validate(value){
      //    if(!validator.isStrongPassword(value)){throw new Error("Use Strong Password")}
      //   }
     },
     cpw:{
       type:String,
       required:true,
       trim:true 
    }
    
  }
  ,{timestamps:true});


  const model=mongoose.model("userDetail",schema)
module.exports=model