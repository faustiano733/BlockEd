import { NextResponse } from "next/server"
import db from "../db/connection"
import { createException, deleteExceptionService, getExceptionsService } from "../services/exceptionService"


export async function createExceptionController(req){
    const data = await req.json()
    const idSchool = req.headers.get('x-school-id')
    const transaction = await db.sequelize.transaction()
    try{
       const exception = await createException({date:data.date,idSchool:idSchool},transaction)
       await transaction.commit()
       return NextResponse.json({sucess:'ok'},{status:201})
    }catch(error){
        await transaction.rollback()
        console.log(error.message)
        return NextResponse.json({error:error.message},{status:500})
    }
}

export async function getAllExceptionsController(req){
    const schoolId = req.headers.get('x-school-id')
    const allExceptions = await getExceptionsService(schoolId)
    console.log(allExceptions)
    if(allExceptions) return NextResponse.json(allExceptions,{status:200})
    return NextResponse.json(allExceptions,{status:200})
}

export async function deleteExceptionController(req){
    const {exception} = await req.json()
    const idSchool = req.headers.get('x-school-id')
    const response = deleteExceptionService(exception, idSchool)
    console.log(response)
    return NextResponse.json({status:201})
}