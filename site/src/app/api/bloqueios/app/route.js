import { NextResponse } from "next/server.js"
import {getApp, activeApp, getAllApps} from "@lib/services/appServices.js"

export async function GET(req){
    let response = ""

    const url = new URL(req.url)
    const param = url.searchParams.get("app")
    if(!(!param)){
        const app = await getApp(param)
        response = app        
    }else{
        const all_apps_list = await getAllApps()
        response = all_apps_list
    }

    return NextResponse.json(response)
}

export async function POST(req){

    const request = await req.json()

    const app_name = request.name

    const app = await addApp(app_name)

    return NextResponse.json(app)

}

export async function PUT(req){

    const request = await req.json()

    const app_name = request.name

    const changed_app = await activeApp(app_name)
    
    return changed_app
}

export async function DELETE(req){
    const request = await req.json()
    
}