import { locationControllerPut } from "@/lib/controllers/locationController"
import { getLocation } from "@/lib/services/locationService"
import { NextResponse } from "next/server"


export async function GET(req){
    const idSchool = req.headers.get('x-school-id')
    const location = await getLocation(idSchool)
    console.log(JSON.stringify(location))
    return NextResponse.json(location)
}

export async function PUT(req){
    return await locationControllerPut(req)   
}