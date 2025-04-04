import { NextResponse } from "next/server"
import { getSchool } from "../services/schoolServices"
import { getUserById } from "../services/userServices"


export async function getProfileDataController(id){
 
    const user = await getUserById(id)
    const school = await getSchool(id)
    
    return NextResponse.json({school:school,user:user})
}