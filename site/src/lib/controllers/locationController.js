import { NextResponse } from "next/server"
import { alterLocationService } from "../services/locationService"

export const locationControllerPut = async (req)=>{

    const idSchool = req.headers.get('x-school-id')
    try{
        const {location} = await req.json()
        const newLocation = await alterLocationService({...location,idSchool:idSchool})
        return NextResponse.json('ok',{status:201})
    }catch(error){
        console.log(`Alguma coisa correu Mal ${error}`)
        return NextResponse.json({error:error},{status:500})
    }
}