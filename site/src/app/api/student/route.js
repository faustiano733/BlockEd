import { NextResponse } from "next/server";
import { linkDevice, createStudent, getStudentInformation, getStudents } from "../../../lib/services/studentService.js";


export async function GET(req){
    let response = ""
    const url = new URL(req.url)
    
    
    const student = url.searchParams.get("student")

    if(!(!student)){
        const student_information = await getStudentInformation(student)
        response = student_information
    }else{
        const all_students_list = await getAllStudents()
        response = all_students_list
    }


    return NextResponse.json(response)
}

export async function POST(req){

    const request = await req.json()
    const new_student = request.student
    const device = request.device

    const created_student = await createStudent(new_student)

    if(!device){
        await linkDevice(device, created_student)
    }

    return NextResponse.json(created_student)
}

export async function UPDATE(req){
    const dados_requesicao = await req.json()

}