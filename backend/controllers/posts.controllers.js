import User from "../models/users.model.js";
import Post from "../models/posts.model.js" ;
import Comments from "../models/comments.model.js";


export const activeCheck= (req,res)=>{
    res.status(500).json({message : "Running"});
}

export const createPost = async(req,res)=>{

    // 1. Header se token nikaalo
        const authHeader = req.headers.authorization;
    // Check karo ki header aaya bhi hai ya nahi aur kya woh 'Bearer ' se shuru ho raha hai
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided, authorization denied" });
        }

        // 💡 'Bearer XYZ123' mein se 'Bearer' ko hata kar sirf asli token ('XYZ123') alag karo
        const token = authHeader.split(" ")[1];

    try{
      const user = await User.findOne({
             token : token
           });
      
           if(!user){
             return res.status(400).json({message: "user not found !"});
        }

        const post = new Post({
            userId : user._id,
            body   : req.body.body,  // body provide by frontend like from input field
            media  : req.file != undefined ? req.file.filename :"",
           fileType : req.file != undefined ? req.file.mimetype.split("/")[1] : ""
        });

        await post.save();

        return res.status(200).json({message : "post created"});
    }
     catch(err){
    return res.status(500).json({message : err.message});
    }
}


export const getAllPosts = async(req,res)=>{

    try{
       const posts = await Post.find().populate("userId" ,"name username email profilePicture");
       res.json({ posts });
    }
    catch(err){
    return res.status(500).json({message : err.message});
    }
}

export const deletePost = async(req,res)=>{

    const {token ,post_id} = req.body
    try{
      
        const user = await User.findOne({
            token
        }).select("_id");
         if(!user){
             return res.status(400).json({message: "user not found !"});
        }

        const post = await Post.findOne({
            _id : post_id
        });
        if(!post){
             return res.status(400).json({message: "post not found !"});
        }
        
        if(post.userId.toString() !== user._id.toString()){
             return res.status(400).json({message: " unauthorized "});
        }

        await post.deleteOne({ _id : post_id });

        return res.json({message : "post is deleted"});

    } catch(err){
    return res.status(500).json({message : err.message});
    }
}

export const commentsPost = async(req,res)=>{

    const { token ,post_id , commentBody } = req.body;

    try{
        const user = await User.findOne({
            token
        });
         if(!user){
             return res.status(400).json({message: "user not found !"});
        }

        const post = await Post.findOne({
            _id : post_id
        });
        if(!post){
             return res.status(400).json({message: "post not found !"});
        }
        
        const comments = new Comments({
            userId : user._id,
            postId : post_id,
            body   : commentBody
        });

        await comments.save();

        return res.status(200).json({ message : "comment created ! "});
    
     }catch(err){
      return res.status(500).json({message : err.message});
    }
}

export const getAllComments = async(req,res)=>{
    const { post_id } = req.query;
    try{
      const post = await Post.findOne({
        _id : post_id
      });
      if(!post){
        return res.status(400).json({message: "post not found !"});
      }

       const comments = await Comments
      .find({postId : post_id})
      .populate("userId" , "username name profilePicture");
       return res.json(comments.reverse())
    
    }
    catch(err){
      return res.status(500).json({message : err.message});
    }
}

export const deleteUserComment = async (req,res)=>{
    const { token , comment_id } = req.body ;
    try{
           const user = await User.findOne({
            token
        }).select("_id");
         if(!user){
             return res.status(400).json({message: "user not found !"});
        }

        const comment = await Comment.findOne({
            _id : comment_id
        });

        if(!comment){
            return res.status(404).json({ message : "comment not found!"});
        }

        if( comment.userId.toString() != user._id.toString() ){
           return res.status(401).json({ message : "Unauthorized"});   
        }

        await Comment.deleteOne({ _id : comment_id});

        return res.json({ message : "comment deleted !"});
    }
    catch(err){
      return res.status(500).json({message : err.message});
    }
}

export const increment_Likes = async(req,res)=>{
    const { post_id } = req.body;
    
    try{
        const post = await Post.findOne({
            _id : post_id
        });

        if(!post){
            return res.status(400).json({message: "post not found !"});
        }
        post.likes = post.likes + 1;

        await post.save();

        return res.json({ message : " likes incremented "});
    }
    catch(err){
      return res.status(500).json({message : err.message});
    }
}