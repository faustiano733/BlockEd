import { NextResponse } from "next/server.js"
import {getApp, activeApp, addApp, getAllApps} from "@lib/services/appServices.js"

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