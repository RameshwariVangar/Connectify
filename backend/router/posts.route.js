import { Router } from "express";
import { activeCheck , commentsPost, createPost, deletePost, deleteUserComment, getAllComments, getAllPosts, increment_Likes } from "../controllers/posts.controllers.js";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage(
    {
        destination : (req,file,cb)=>{  //callback function
            cb(null,"uploads/");
        },
        filename : (req,file,cb)=>{
            cb(null,file.originalname);
        }
    }
);

const upload = multer({storage:storage});

router.get("/",activeCheck);

router.post("/post",upload.single('media'),createPost);

router.get("/posts",getAllPosts);
router.delete("/delete_post",deletePost);
router.post("/comment_post",commentsPost);
router.get("/get_comments",getAllComments);
router.delete("/delete_comments",deleteUserComment);
router.post("/increment_post_likes",increment_Likes);


export default router ;