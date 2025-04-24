import { generateSchoolCodeController } from "@/lib/controllers/schoolCodeController";
import { StudentsController } from "@/lib/controllers/studentController";

export async function GET(req){        
    return await StudentsController.get(req)
}

export async function POST(req){
    return await generateSchoolCodeController(req)
}

