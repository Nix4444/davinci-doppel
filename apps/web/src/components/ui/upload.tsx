"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import axios from "axios";
import JSZip from "jszip";
import { useState } from "react";
interface uploadModalProps{
  onUploadDone:(zipUrl:string)=>void,
  setLoading:(loading:boolean)=>void,
  setError:(error:boolean)=>void
}
export function UploadModal(props:uploadModalProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Images</CardTitle>
        <CardDescription>Drag and drop your images or click the button below to select files.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-10 space-y-6">
        <CloudUploadIcon className="w-16 h-16 text-zinc-500 dark:text-zinc-400" />
        <Button variant="outline" onClick={()=>{
            const zip = new JSZip();
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.multiple = true;
            input.onchange = async () => {
                console.log(input.files);
                const res = await axios.get(`http://localhost:3002/pre-signed-url`)
                const s3Url = res.data.url;
                const s3Key = res.data.key;
                if(input.files){
                    for(const file of input.files){
                        const content = await file.arrayBuffer();
                        zip.file(file.name,content);

                    }
                    try{
                      const content = await zip.generateAsync({type:"blob"});
                      const formData = new FormData();
                      formData.append("file",content,s3Key);
                      formData.append(s3Key,s3Url);
                      props.setLoading(true)
                      const s3Response = await axios.put(s3Url,formData)
                      props.setLoading(false)
                      props.onUploadDone(`${process.env.S3BUCKET_URL}/${s3Key}`)
                    }catch(e){
                      props.setLoading(false)
                      props.setError(true)

                    }
                    
                    
                }
                
            }
            input.click();
            
        }}>
        Select Files</Button>
      </CardContent>
    </Card>
  )
}

function CloudUploadIcon(props:React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  )
}