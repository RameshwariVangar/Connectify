import mongoose from "mongoose";

const postSchema = new mongoose.Schema({  //schema define for post model
    userId: {
        type : mongoose.Schema.Types.ObjectId, //store id of another document (single record store inside collection)
        ref : "User" // write model name for userData
       },
    body : {
        type :String,
        required : true 
    },
    likes:{
        type : Number ,
        default : 0 
    },
    createdAt : {
       type : Date,
       default : Date.now 
    },
    updatedAt :{
       type : Date,
       default : Date.now 
    },
    media : {
          type: String,
          default : " "
    },
    active :{
        type : Boolean,
        default : true
    },
    fileType :{
            type: String,
          default : " "
    }
});

const Post = mongoose.model("Post" , postSchema); // model is created mongoose.mode("modelname" ,schema)

export default Post ;