import { NextResponse } from "next/server"
import { getSchool } from "../services/schoolServices"
import { getUserById, updateName } from "../services/userServices"
import db from "../db/connection"


export async function getProfileDataController(id){
    const user = await getUserById(id)
    const school = await getSchool(id)
    return NextResponse.json({school:school,user:user})
}

export async function updateProfileController(req){
    const userID = req.headers.get('x-user-id')
    const data = await req.json()
    let response = null
    console.log(data.name)
    if(data.name){
        const transaction = await db.sequelize.transaction()
        try{
            response = await updateName({name:data.name, id:userID},transaction)
            console.log(response)
        }
        catch(error){
            transaction.rollback()
            response = error.message
            console.log(error.message)
        }
    }

    if(data.oldPassword && data.newPassword){
        
    }

    return NextResponse.json(response)


}