import { NextResponse } from "next/server.js"
import {getApp, activeApp, addApp, getAllApps} from "@lib/services/appServices.js"

export async function GET(req){
    let response = ""
    const schoolId = req.headers.get('x-school-id');
    const url = new URL(req.url)
    
    const param = url.searchParams.get("app")
    if(!(!param)){
        const app = await getApp(param)
        response = app        
    }else{
        const all_apps_list = await getAllApps(schoolId)
        response = all_apps_list
    }

    return NextResponse.json(response)
}