import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ThemeProvider } from "@/components/theme-provider"
import { Switch } from "@/components/ui/switch"
import { UploadModal } from "@/components/ui/upload"
import { useState } from "react"
import { TrainModelInput, GenerateImageInput, GenerateImagesFromPackInput } from "@repo/common/inferred"
import { useRouter } from "next/navigation"

export default function Train() {
  const [zipUrl, setZipUrl] = useState<string>("");
  const [type, setType] = useState("");
  const [age, setAge] = useState<string>("");
  const [ethinicity, setEthinicity] = useState<string>("");
  const [eyeColor, setEyeColor] = useState<string>("");
  const [bald, setBald] = useState<boolean>(false);
  const [name, setName] = useState<string>("")
  const router = useRouter();

  async function trainModel() {
    const input:TrainModelInput = {
      zipUrl,
      type,
      age: parseInt(age ?? "0"),
      ethinicity,
      eyeColor,
      bald,
      name
    }
  }
  return <div className="flex flex-col items-center justify-center h-full">
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Name of your model</CardTitle>
          <CardDescription>Fill in the details of the model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of your project" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Age</Label>
              <Input id="name" placeholder="Age of the model" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Type</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="Man">Man</SelectItem>
                  <SelectItem value="Woman">Woman</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>


            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Ethinicity</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="White">White</SelectItem>
                  <SelectItem value="Black">Black</SelectItem>
                  <SelectItem value="AsianAmerican">Asian American</SelectItem>
                  <SelectItem value="EastAsian">East Asian</SelectItem>
                  <SelectItem value="SouthEastAsian">South East Asian</SelectItem>
                  <SelectItem value="SouthAsian">South Asian</SelectItem>
                  <SelectItem value="MiddleEastern">Middle Eastern</SelectItem>
                  <SelectItem value="Hispanic">Hispanic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Eye Colour</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="Black">Black</SelectItem>
                  <SelectItem value="Brown">Brown</SelectItem>
                  <SelectItem value="Hazel">Hazel</SelectItem>
                  <SelectItem value="Gray">Gray</SelectItem>
                  <SelectItem value="Blue">Blue</SelectItem>
                  <SelectItem value="Green">Green</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Bald</Label>
              <Switch />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Upload your images</Label>
              <UploadModal onUploadDone={() => {

              }} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Create Model</Button>
        </CardFooter>
      </Card>
    </ThemeProvider>

  </div>

}