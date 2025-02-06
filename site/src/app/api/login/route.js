import { login } from "@/lib/services/accountServices"
import { NextResponse } from "next/server"


export async function POST(req){
    let logged = false
    const request_data = await req.json()
    const valid_user = (request_data.email && request_data.password)

    if(valid_user){
        logged = login(request_data.email, request_data.password)
    }else{
        return NextResponse.error('Invalid Dates')
    }

    if(logged){
        NextResponse.redirect('/')
    }else{
        return NextResponse.error("Invalid User Email or password")
    }
}