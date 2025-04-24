import { NextResponse } from "next/server"
import { createSchoolCode } from "../services/schoolCodeService"

export async function generateSchoolCodeController(req){
    const idSchool = req.headers.get('x-school-id')
 
    try{
        const code = await createSchoolCode(idSchool)
        return NextResponse.json(code,{status:201})
    }catch(error){
        console.log(error)
        return NextResponse.json({error:error.messge},{status:500})
    }
}