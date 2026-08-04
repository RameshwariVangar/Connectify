import mongoose from "mongoose";


const comments = new mongoose.Schema({
    userId:{
       type : mongoose.Schema.Types.ObjectId,
       ref : "User",
    },
    postId:{
       type : mongoose.Schema.Types.ObjectId,
       ref : "User",
    },
    body:{
       type : String,
       required : true
    }
});

const Comments = mongoose.model("Comments",comments);

export default Comments;