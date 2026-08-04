import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postRoutes from "./router/posts.route.js"; 
import userRoutes from "./router/users.route.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(postRoutes);
app.use(userRoutes);

app.use(express.static("uploads"));  // makes all files in uploads public , means can be access directly from browser




const start = async ()=>{
const connectDB = await mongoose.connect("mongodb://rameshwarivangar_db_user:gVmRtoEZoPtn5odM@ac-jsikaem-shard-00-00.inlhgli.mongodb.net:27017,ac-jsikaem-shard-00-01.inlhgli.mongodb.net:27017,ac-jsikaem-shard-00-02.inlhgli.mongodb.net:27017/?ssl=true&replicaSet=atlas-1s1hgu-shard-0&authSource=admin&appName=Cluster0")
  app.listen(9090,()=>{
    console.log("server is running on port 9090");
  })
}

start();

