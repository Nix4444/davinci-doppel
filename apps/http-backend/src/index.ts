import express from "express";
import dotenv from "dotenv"
import { TrainModel,GenerateImage,GenerateImageFromPack } from "@repo/common/types";
import { prismaClient } from "@repo/db";
dotenv.config();
const PORT = process.env.PORT || 3002
const app = express();
app.use(express.json());
const USERID = "REPLACE WITH CLERK USERID"
app.post("/ai/training",async (req,res)=>{ //to train a model on a bunch of photos
    const parsedBody = TrainModel.safeParse(req.body);

    if(!parsedBody.success){
        res.status(411).json({
            message: "Invalid inputs"
        })
        return;
    }
    const data = await prismaClient.model.create({
        data:{
           name:parsedBody.data.name,
           type:parsedBody.data.type,
           age:parsedBody.data.age,
           ethinicity:parsedBody.data.ethinicity,
           eyeColor: parsedBody.data.eyeColor,
           bald:parsedBody.data.bald,
           userId: USERID

        }

    })
    // update the images table
    res.json({
        modelId: data.id
    })
})
app.post("/ai/generate",async(req,res)=>{ //to generate an image from a prompt
    const parsedBody = GenerateImage.safeParse(req.body)
    if(!parsedBody.success){
        res.status(411).send({
            message: "Invalid inputs"
        })
        return;
    }
    const data = await prismaClient.outputImages.create({
        data: {
            prompt:parsedBody.data.prompt,
            userId:USERID,
            modelId:parsedBody.data.modelId,
            imageUrl:""
        }
    })
    res.json({
        imageId:data.id
    })

    
})
app.post("/pack/generate",async (req,res)=>{ //generate a bunch of images, on a pack
    const parsedBody = GenerateImageFromPack.safeParse(req.body);
    if(!parsedBody.success){
        res.status(411).send({
            message: "Invalid inputs"
        })
        return;
    }
    const prompts = await prismaClient.packPrompts.findMany({
        where:{
            packId:parsedBody.data.packId
        }
    })
    const images = await prismaClient.outputImages.createManyAndReturn({
        data:prompts.map((prompt)=>({
            prompt:prompt.prompt,
            modelId:parsedBody.data.modelId,
            userId:USERID,
            imageUrl:""
        }))

    })
    res.json({
        images:images.map((image)=>image.id)
    })

})
app.get("/pack/bulk",async(req,res)=>{ //Get all the packs
    const packs = await prismaClient.packs.findMany({})
    res.json({
        packs
    })


})
app.get("/image/bulk",async (req,res)=>{
    const imageIds = req.query.images as string[];
    const limit = req.query.limit as string || "10";
    const offset = req.query.offset as string || "0";
    const imagesData = await prismaClient.outputImages.findMany({
        where:{
            id:{in:imageIds},
            userId:USERID
        },
        skip:parseInt(offset),
        take:parseInt(limit)
    })
    res.json({
        images:imagesData
    })

})


app.listen(PORT,async ()=>{
    console.log(`HTTP backend UP @ PORT ${PORT}`);
})