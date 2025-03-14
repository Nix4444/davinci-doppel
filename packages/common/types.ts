import {z} from "zod";

export const TrainModel = z.object({
    name:z.string(),
    type:z.enum(["Man","Woman","Others"]),
    age:z.number(),
    ethinicity: z.enum(["White","Black","AsianAmerican","EastAsian","SouthEastAsian","SouthAsian","MiddleEastern","Hispanic"]),
    eyeColor:z.enum(["Black","Brown","Hazel","Gray","Blue","Green"]),
    bald:z.boolean(),
    zipUrl:z.string()


})


export const GenerateImage = z.object({
    prompt:z.string(),
    modelId:z.string(),
    num:z.number()

})

export const GenerateImageFromPack = z.object({
    packId:z.string(),
    modelId:z.string()

})