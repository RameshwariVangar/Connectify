import mongoose from "mongoose";
import Profile from "../models/profiles.model.js";
import User from "../models/users.model.js";
import Chat from "../models/chats.model.js"

import bcrypt from "bcrypt";
import crypto from "crypto";

import PDFDocument from 'pdfkit';
import fs from "fs"; 
import connectionReq from "../models/connections.model.js";
import path from "path";
import sharp from "sharp";


     
    const convertUserDataTOPDF = async (userData) => {
    const doc = new PDFDocument();
    const outputPath = crypto.randomBytes(16).toString("hex") + ".pdf";
    const stream = fs.createWriteStream(path.join("uploads", outputPath));
    doc.pipe(stream);

    // Profile Picture Handling
    const pic = userData?.userId?.profilePicture;
    if (pic) {
        const cleanPic = pic.replace(/^uploads[\\/]/, "");
        const imgPath = path.join(process.cwd(), "uploads", cleanPic);

        if (fs.existsSync(imgPath)) {
            let imageBuffer = fs.readFileSync(imgPath);
            if (path.extname(imgPath).toLowerCase() === ".webp") {
                // Ab ye await bina kisi error ke kaam karega
                imageBuffer = await sharp(imgPath).toFormat("png").toBuffer();
            }
            doc.image(imageBuffer, 50, 40, { width: 90 });
            doc.y = 140;
        }
    }

    // User Info
    doc.fontSize(14).text(`Name: ${userData?.userId?.name || ""}`);
    doc.fontSize(12).text(`Username: @${userData?.userId?.username || ""}`);
    doc.fontSize(12).text(`Email: ${userData?.userId?.email || ""}`);
    doc.fontSize(12).text(`Bio: ${userData?.bio || ""}`);
    doc.fontSize(12).text(`Position: ${userData?.currentPost || ""}`);
    doc.moveDown();

    // Past Work
    if (userData?.pastWork?.length) {
        doc.fontSize(14).text("Past Work:");
        userData.pastWork.forEach((w) => {
            doc.fontSize(11).text(`Company: ${w.company} | Role: ${w.position} | Years: ${w.years}`);
        });
    }

    doc.end();

    // Stream complete hone ka wait karein
    return new Promise((resolve, reject) => {
        stream.on("finish", () => resolve(outputPath));
        stream.on("error", reject);
    });
};




export const register = async(req,res)=>{
    try{
        
        const{name,email,username,password} = req.body;

        if(!name || !email || !username || !password) return res.status(400).json({message : "All Fields are required"});

        // 💡 FIX: Check karo agar Email YA Username dono mein se kuch bhi pehle se exist karta hai
        const userExist = await User.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        });

        // 💡 FIX: Agar kuch bhi mila, toh user ko batao ki kya dikkat hai
        if (userExist) {
            if (userExist.email === email) {
                return res.status(400).json({ message: "Email already exists" });
            }
            if (userExist.username === username) {
                return res.status(400).json({ message: "Username is already taken" });
            }
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            name,
            email,
            password : hashedPassword,
            username
        });

        await newUser.save();

        //create prfile for each new user
        const profile = new Profile({userId : newUser._id}); 

        await profile.save();

         const token = crypto.randomBytes(32).toString("hex");
     await User.updateOne({ _id : newUser._id }, { token }); // DB mein token daal diya

// 💡 FIX: Message ke saath TOKEN bhi response mein bhej do!
        return res.json({ message: "User is created", token: token });
    }
    catch(err){
        return res.status(500).json({message : err.message}); 
    }
}

export const login = async(req,res)=>{
 try{
  const {email,password} = req.body;
  if(!email || !password ) return res.status(400).json({message:"All Fields are required"});

  const user = await User.findOne({
    email
  });

  if(!user) return res.status(404).json({message:"User not exist"});

  const isMatch = await bcrypt.compare(password,user.password);

  if(!isMatch) return res.status(500).json({message:"Invalid Creditials"});

  const token = crypto.randomBytes(32).toString("hex");

  await User.updateOne({_id : user._id},{ token }) ; //update token at id = user.id

  return res.json({token});
  }
  catch(err){
      res.status(500).json({message:err.message});
  }

}

export const uploadProfilePicture = async(req,res)=>{
     const {token} = req.body;

 try{
      const user = await User.findOne({
       token : token
     });

     if(!user){
       return res.status(400).json({message: "user not found !"});
     }

     user.profilePicture = req.file.filename;

     await user.save();

     return res.json({message:"Profile picture updated"});

 }  catch(err){
    return res.status(500).json({message : err.message});
    }
}

export const updateUserProfile = async(req,res)=>{   // only for user model
       const {token , ...newUserData} = req.body;

    try{
       const user = await User.findOne({
        token
       });

       if(!user){
        return res.status(400).json({message : "user not found"});
       }

       const {username , email} = newUserData;

       const existingUser =await User.findOne({
        $or: [{username : username} , {email : email}]
       });

       // if user who want to change its username is really he by comparing id check he is not using anothers
       //username email to change 
       if(existingUser){
        if(existingUser || String(existingUser._id) != String(user._id)){
            return res.status(400).json({message : "User already exist"});
        }
       }

       Object.assign(user,newUserData);

       await user.save();

       return res.json({message:"User Profile updated"});
  }
    catch(err){
        return res.status(500).json({message : err.message});
    }
}


export const getUserAndProfile = async (req,res)=>{  // show updated profile (profile model)

    try{
        const {token} = req.query;

        const user = await User.findOne({
            token
        });

        if(!user){
             return res.status(400).json({message : "user not found"});
        }

        let userProfile = await Profile.findOne({
            userId : user._id    //in profile model userId is ref to userId in user model
        })
        .populate('userId','name email username profilePicture');

        if (!userProfile) {
            userProfile = new Profile({ userId: user._id });
            await userProfile.save();
            userProfile = await Profile.findOne({ userId: user._id }).populate('userId', 'name email username profilePicture');
        }

        return res.json({ userProfile });

        
    }
    catch(err){
        return res.status(500).json({message : err.message});
    }
}

export const updateProfileData = async(req,res)=>{  // update Profile (profile model)
   try{
       const {token , ...newProfileData} = req.body;

       const userProfile = await User.findOne({
         token: token
       });

       if(!userProfile){
           return res.status(400).json({message : "user not found"});
       }

       const profile_to_update = await Profile.findOne({
         userId : userProfile._id
       });

       Object.assign(profile_to_update , newProfileData);

       console.log("Token check:", userProfile);
       console.log("Profile check:", profile_to_update);

       profile_to_update.markModified('pastWork');
       profile_to_update.markModified('education');
       profile_to_update.markModified('bio');
       profile_to_update.markModified('currentPost');

       await profile_to_update.save();

       return res.json({message:"Profile update"});
   }
   catch(err){
         return res.status(500).json({message : err.message});
   }
}

export const getAllUserProfile = async(req,res)=>{
    try{
        const profiles = await Profile.aggregate([
            {
                $lookup: {
                    from: "posts",
                    localField: "userId",
                    foreignField: "userId",
                    as: "userPosts"
                }
            },
            {
                $addFields: {
                    postCount: { $size: "$userPosts" }
                }
            },
            {
                $sort: { postCount: -1 }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userId"
                }
            },
            {
                $unwind: {
                    path: "$userId",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    userPosts: 0,
                    "userId.password": 0,
                    "userId.token": 0
                }
            }
        ]);
        
        return res.json({ profiles });
    }
    catch(err){
         return res.status(500).json({message : err.message});
    }
}

export const downloadProfile = async (req, res) => {
    try {
        const user_id = req.query.id;

        const userProfile = await Profile.findOne({
            userId: user_id
        }).populate("userId", "name username email profilePicture");

        if (!userProfile) {
            return res.status(404).json({ message: "User profile not found" });
        }

        let outputPath = await convertUserDataTOPDF(userProfile);

        return res.json({ message: outputPath });
    } catch (error) {
        console.error("Download Profile Error:", error);
        return res.status(500).json({ message: "Error generating resume PDF" });
    }
};


export const sendConnectionReq = async(req,res)=>{

    const { token , connectionId} = req.body;

    try{
        const user = await User.findOne({
            token 
        });

        if(!user){
           return res.status(400).json({message : "user not found"});
       }
        
      const connectionUser = await connectionReq({
            _id : connectionId 
      });

      if(!connectionUser){
       return res.status(404).json({message : "Connection User not found"});
      }

      const existingRequest = await connectionReq.findOne({
           userId : user._id,
           connectionId : connectionUser._id 
      });

      if(existingRequest){
        return res.status(400).json({message : "Request already send"});
      }

     const request = new connectionReq({
           userId : user._id,
           connectionId : connectionUser._id 
      });

      await request.save();

      return res.json({mesaage : "request sent"});

    }
    catch(err){
         return res.status(500).json({message : err.message});
    }
}



export const getConnectionReq = async(req,res)=>{  //connections Req send by user
    const { token } = req.query;

    

    try{
         const user = await User.findOne({
            token : token
        });

        if(!user){
           return res.status(400).json({message : "user not found"});
       } 

       const connections = await connectionReq.find({
         userId : user._id
       }).populate("connectionId" , "name username email profilePicture");
       
       return res.json( connections )
    } 
    catch(err){
         return res.status(500).json({message : err.message});
    }
}



export const whatAreMyConnections = async(req,res)=>{  //connections Req send by user
    const { token } = req.query;

    try{
         const user = await User.findOne({
            token 
        });

        if(!user){
           return res.status(400).json({message : "user not found"});
       } 

       const connections = await connectionReq.find({
         connectionId : user._id
       }).populate("userId" , "name username email profilePicture");
       
       return res.json( connections );
    } 
    catch(err){
         return res.status(500).json({message : err.message});
    }
}

export const acceptConnectionReq = async(req,res)=>{
    const { token , request_id , action_type } = req.body;

     try{
         const user = await User.findOne({
            token 
        });

        if(!user){
           return res.status(400).json({message : "user not found"});
       } 
       const connection = await connectionReq.findOne({
            _id : request_id 
       });

       if(!connection){
          return res.status(400).json({message : "connection not find"});
       }

       if(action_type === "accept"){
         connection.status_accepted = true ;
       }
       else{
            connection.status_accepted = false ;
       }
      
       await connection.save();
       return res.json({message : "status updated"});

     }
     catch(err){
         return res.status(500).json({message : err.message});
    }

}


export const userProfileAndUserFromusername = async(req,res)=>{

    const {username} = req.query ;

    try{
        const user = await User.findOne({
            username : username
        });

        if(!user){
            return res.status(404).json({message:"user not found"})
        }

         console.log(user._id);

        const userProfile = await Profile.findOne({userId : user._id})
        .populate("userId" , "name username email profilePicture");

       

        return res.json({'profile': userProfile})
    }
    catch(err){
        return res.json({mesaage : err.mesaage})
    }

}


// Backend Route: /api/users/search?query=a
export const search =  async (req, res) => {
    try {
        const { query } = req.query; // Frontend se jo type kiya vo milega (e.g., 'a')

        if (!query) {
            return res.status(400).json({ message: "Search query is empty" });
        }

        // MongoDB Query
        const users = await User.find({
            $or: [
                { name: { $regex: `^${query}`, $options: "i" } },     // Check 1: Kya Name 'query' se start hota hai?
                { username: { $regex: `^${query}`, $options: "i" } } // Check 2: Kya Username 'query' se start hota hai?
            ]
        })
        .select("name username profilePicture") // Sirf zaroori details hi nikalenge
        .limit(10); // Taaki ek baar mein max 10 users hi dikhein (performance ke liye)

        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during search" });
    }
};

// backend/controllers/users.controllers.js
export const accessChat = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        
        console.log("Backend Processing -> Sender:", senderId, "Receiver:", receiverId);

        if (!senderId || !receiverId) {
            return res.status(400).json({ message: "Dono IDs hona zaroori hain!" });
        }

        const senderUser = await User.findById(senderId).select("name username profilePicture");
        const receiverUser = await User.findById(receiverId).select("name username profilePicture");

        // 🔍 1. Check karo ki kya in dono ke beech pehle se koi chat room hai?
        let chat = await Chat.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        // 🆕 2. Agar dono ke beech pehle se koi room nahi mila, toh naya banao
        if (!chat) {
            console.log("Pehle se chat nahi mili, creating fresh room...");
            
            // 🌟 FIX: Idhar se 'const' hata diya, taaki upar wala 'let chat' update ho jaye!
            chat = await Chat.create({
                participants: [senderId, receiverId], 
                messages: []
            });
        }

        // 🌟 SAFETY CHECK: Agar kisi wajah se ab bhi chat null hai toh safe return karo
        if (!chat) {
            return res.status(400).json({ message: "Chat room structure fetch nahi ho paya." });
        }

        // 3. Ab toObject() perfectly chalega kyunki chat mein naya ya purana data aa chuka hai
        let chatData = chat.toObject();
        chatData.participants = [senderUser, receiverUser]; // Dono users ka solid data inject kar diya!

        // 4. Frontend ko bhej do
        return res.status(200).json(chatData);

    } catch (err) {
        console.error("Backend error caught:", err);
        return res.status(500).json({ error: err.message });
    }
};

export const sendMsg = async (req, res) => {
    try {
        const { chatId, senderId, messageText } = req.body;

        if (!chatId || !messageText) {
            return res.status(400).json({ message: "Chat ID and message text are required" });
        }

        const newMessage = {
            senderId: senderId,
            messageText: messageText,
            timestamp: new Date()
        };

        // 🪄 .populate("participants") lagana zaroori hai taaki profile details lost na ho!
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { $push: { messages: newMessage } },
            { new: true }
        ).populate("participants", "name username profilePicture");

        if (!updatedChat) {
            return res.status(404).json({ message: "Chat room not found" });
        }

        res.status(200).json(updatedChat);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while sending message" });
    }
};

export const participateChat = async (req, res) => {
    try {
        const { loggedUserId } = req.query;

        console.log("Backend Received ID:", loggedUserId);

        // 🌟 SAFETY GATE: Agar string "undefined" aayi toh query mat chalao, yahi se bhaga do!
        if (!loggedUserId || loggedUserId === "undefined" || loggedUserId.length !== 24) {
            console.log("❌ Blocked: Invalid ID string received on backend");
            return res.status(200).json([]); // Ya 400 bad request de sakti hain
        }

        const searchId = new mongoose.Types.ObjectId(loggedUserId);

        const userChats = await Chat.find({
            participants: { $in: [searchId] }
        }).populate("participants", "name username profilePicture"); 

        console.log("Success: Chats fetched from DB, count:", userChats.length);
        return res.status(200).json(userChats);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};




export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.query;

        console.log("id=", messageId);

        if (!messageId ) {
            return res.status(400).json({ message: "Valid Message ID missing!" });
        }

        const targetMessageId = new mongoose.Types.ObjectId(messageId);

       
        const updatedChat = await Chat.findOneAndUpdate(
            { "messages._id": targetMessageId }, 
            { 
                $pull: { messages: { _id: targetMessageId } } // Messages array se use delete kiya
            },
            { new: true } 
        );

        if (!updatedChat) {
            return res.status(404).json({ message: "Chat Not found" });
        }

        console.log(" Message successfully pulled from array!");
        
        // Frontend ko confirmation aur messageId dono bhejo taaki reducer UI update kar sake
        return res.status(200).json({ 
            message: "Message deleted successfully!", 
            messageId: messageId 
        });

    } catch (err) {
        console.error("Error in deleteMessage:", err);
        return res.status(500).json({ message: err.message });
    }
};