import {Router} from "express";
import { register,login,uploadProfilePicture,updateUserProfile,getUserAndProfile,updateProfileData, getAllUserProfile, downloadProfile, getConnectionReq, sendConnectionReq, whatAreMyConnections, acceptConnectionReq , userProfileAndUserFromusername , search, accessChat, sendMsg, participateChat, deleteMessage } from "../controllers/users.controllers.js";
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

const upload = multer({storage : storage});

router.post("/upload_profile_picture",upload.single("profile_picture"),uploadProfilePicture);

router.post("/register",register);
router.post("/login",login);
router.post("/user_update",updateUserProfile);
router.get("/get_user_and_profile",getUserAndProfile);
router.post("/update_profile_data",updateProfileData);
router.get("/user/get_all_usersprofile",getAllUserProfile);
router.get("/user/download_resume",downloadProfile);
router.post("/user/send_connection_requests",sendConnectionReq);
router.get("/user/getconnectionrequests", getConnectionReq);
router.get("/user/my_connection_req",whatAreMyConnections);
router.post("/user/accept_connection_req",acceptConnectionReq);
router.get("/user/get_profile_based_on_username",userProfileAndUserFromusername);
router.get("/user/search" , search);
router.post("/access_Chats", accessChat );
router.post("/send_msg", sendMsg);
router.get("/getChats" , participateChat);
router.delete("/delete_msg" , deleteMessage );

export default router ;