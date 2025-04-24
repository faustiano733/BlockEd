import { NextResponse } from "next/server";
import { createStudent, getAllStudents, getStudentInformation } from "../services/studentService";
import db from "../db/connection";
import { createDevice } from "../services/deviceServices";

export async function get(req){
    let status = 200
    const url = new URL(req.url);
    const student = url.searchParams.get('q')
    if(student){
        const listStudents = getStudentInformation(idSchool)
        if(listStudents){
            status = 201
        }
        console.log(listStudents)
        return NextResponse.json(listStudents,{status:status})    
    }
    const idSchool = req.headers.get('x-school-id')
    const list_students = await getAllStudents(idSchool)
    
    return NextResponse.json(list_students,{status:status})
}

export async function createStudentController(idSchool,student_data,device_data){

    const transaction = await db.sequelize.transaction()
    try{
        const new_student = await createStudent({idSchool, ...student_data},{transaction:transaction})

        const new_device = await createDevice({...device_data,idStudent:new_student.id}, {transaction:transaction})
        await transaction.commit()
    }catch(error){
        await transaction.rollback()
        console.log(error.message)
    }
}

export const StudentsController = {get:get}