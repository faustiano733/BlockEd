import { StudentsController } from "@/lib/controllers/studentController";
import { NextResponse } from "next/server";

export async function GET(req){    
    
    return await StudentsController(req)
}

