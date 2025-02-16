import express from "express";
import dotenv from "dotenv"
import { TrainModel,GenerateImage,GenerateImageFromPack } from "@repo/common/types";
dotenv.config();
const PORT = process.env.PORT || 3002
const app = express()


app.post("/ai/training",(req,res)=>{ //to train a model on a bunch of photos

})

app.post("/ai/generate",(req,res)=>{ //to generate an image from a prompt
    
})


app.post("/pack/generate",(req,res)=>{ //generate a bunch of images, on a pack


})

app.get("/pack/bulk",(req,res)=>{ //Get all the packs


})

app.get("/pack/image",(req,res)=>{ //to fetch the generated image

})


app.listen(PORT,async ()=>{
    console.log(`HTTP backend UP @ PORT ${PORT}`)
})