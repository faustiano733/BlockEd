import { validateSite } from "@/lib/services/siteServices"
import { NextResponse } from "next/server"

export const POST = async (req)=>{
    const {url} = await req.json()
    
    const valideSite = await validateSite(url)
    console.log(valideSite)
    return NextResponse.json(valideSite)
}