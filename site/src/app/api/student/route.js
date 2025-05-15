import { NextResponse } from "next/server.js";
import { generateSchoolCodeController } from "@/lib/controllers/schoolCodeController";
import { StudentsController } from "@/lib/controllers/studentController";
import {editStudent} from "@lib/services/studentService";

export async function GET(req){        
    return await StudentsController.get(req)
}

export async function POST(req){
    return await generateSchoolCodeController(req)
}

export async function PUT(req){
    const dados = await req.json();

    const student = dados.student;
    try{
        editStudent({id: student.id, uninstall: !student.uninstall})
    } catch {
        return NextResponse.json({success: false});
    }
    return NextResponse.json({success: true})
}

