import express from "express";
import dotenv, { parse } from "dotenv"
import { TrainModel,GenerateImage,GenerateImageFromPack } from "@repo/common/types";
import { FalAiModel } from "./FalAiModel";
import { prismaClient } from "@repo/db";
import { S3Client,PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import cors from "cors";
dotenv.config();
const s3Client = new S3Client({
    region:process.env.S3_REGION || "",
    credentials:{
        accessKeyId:process.env.S3_ACCESSKEYID || "",
        secretAccessKey:process.env.S3_SECRETACCESSKEY || ""
    }})
const PORT = process.env.PORT || 3002
const falAIModel = new FalAiModel()
const app = express();
app.use(cors())
app.use(express.json());
const USERID = "REPLACE WITH CLERK USERID"

app.get("/pre-signed-url",async(req,res)=>{
    const key = `models/${Date.now()}_${Math.random()}.zip`
    const putObjectParams:PutObjectCommandInput = {
        Bucket: process.env.S3_NAME || "",
        ContentType: "application/zip",
        ACL:'public-read',
        Key:key
    }
    const command = new PutObjectCommand(putObjectParams);
    const url = await getSignedUrl(s3Client,command,{expiresIn:60*5})
    res.json({
        url,
        key
    })

})
app.post("/ai/training",async (req,res)=>{ //to train a model on a bunch of photos
    const parsedBody = TrainModel.safeParse(req.body);

    if(!parsedBody.success){
        res.status(411).json({
            message: "Invalid inputs"
        })
        return;
    }

    const {request_id,response_url} = await falAIModel.trainModel(parsedBody.data.zipUrl,parsedBody.data.name)
    const data = await prismaClient.model.create({  
        data:{
           name:parsedBody.data.name,
           type:parsedBody.data.type,
           age:parsedBody.data.age,
           ethinicity:parsedBody.data.ethinicity,
           eyeColor: parsedBody.data.eyeColor,
           bald:parsedBody.data.bald,
           userId: USERID,
           falAiRequestId:request_id,
           zipUrl:parsedBody.data.zipUrl

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
    const model = await prismaClient.model.findUnique({
        where:{
            id:parsedBody.data.modelId
        }
    })
    if(!model || !model.tensorPath){
        res.status(411).json({
            message:"Model not found"
        })
        return;
    }
    const {request_id,response_url} = await falAIModel.generateImage(parsedBody.data.prompt,model.tensorPath)
    const data = await prismaClient.outputImages.create({
        data: {
            prompt:parsedBody.data.prompt,
            userId:USERID,
            modelId:parsedBody.data.modelId,
            imageUrl:"",
            falAiRequestId:request_id
        }
    })
    res.json({
        imageId:data.id
    })

    
})
app.post("/pack/generate",async (req,res)=>{//generate a bunch of images, on a pack
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
    
    const model = await prismaClient.model.findUnique({
        where:{
            id:parsedBody.data.modelId
        }
    });
    if(!model || !model.tensorPath){
        res.status(411).json({
            message:"Model not found"
        })
        return;
    }
    
    const tensorPath = model.tensorPath
    let requestIds:{request_id:string}[] =  await Promise.all(prompts.map((prompt)=>falAIModel.generateImage(prompt.prompt,tensorPath)));
    const images = await prismaClient.outputImages.createManyAndReturn({
        data:prompts.map((prompt,index)=>({
            prompt:prompt.prompt,
            modelId:parsedBody.data.modelId,
            userId:USERID,
            imageUrl:"",
            falAiRequestId: requestIds[index]?.request_id 
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

app.post("/fal-ai/webhook/train",async (req,res)=>{
    console.log(req.body);
    //update the status of the image in the DB
    const requestId = req.body.request_id;
    await prismaClient.model.updateMany({
        where:{
            falAiRequestId:requestId
        },
        data: {
            trainingStatus:"Generated",
            tensorPath:req.body.tensor_path
        }
    })
    res.json({
        message:"Webhook received"
    })
})
app.post("/fal-ai/webhook/image ",async (req,res)=>{
    console.log(req.body);
    //update the status of the image in the DB
    const requestId = req.body.request_id;
    await prismaClient.outputImages.updateMany({
        where:{
            falAiRequestId:requestId
        },
        data: {
            status:"Generated",
            imageUrl:req.body.image_url
        }
    })
    res.json({
        message:"Webhook received"
    })
})
app.listen(PORT,async ()=>{
    console.log(`HTTP backend UP @ PORT ${PORT}`);
})