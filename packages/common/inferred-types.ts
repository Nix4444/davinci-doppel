import { GenerateImage,GenerateImageFromPack,TrainModel } from "./types";
import { z } from "zod";
export type TrainModelInput = z.infer<typeof TrainModel>;
export type GenerateImageInput = z.infer<typeof GenerateImage>;
export type GenerateImagesFromPackInput = z.infer<typeof GenerateImageFromPack>;