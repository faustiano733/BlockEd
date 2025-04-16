import { getLocation } from "@/lib/services/locationService"
import { NextResponse } from "next/server"


export async function GET(req){
    const idSchool = req.headers.get('x-school-id')
    const location = await getLocation(idSchool)
    return NextResponse.json(location)
}