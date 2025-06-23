import "pg";

import { NextResponse } from "next/server.js"
import {getApp, activeApp, addApp, getAllApps} from "@lib/services/appServices.js"
import AppControler from "@/lib/controllers/AppController"

export async function GET(req){
    return await AppControler.GET(req)
}

export async function POST(req){
    return await AppControler.POST(req)
}

export async function PUT(req){
    const request = await req.json()

    const app_name = request.name;
    //const app_package = request.package

    const changed_app = await activeApp(app_name);
    
    return changed_app
}

export async function DELETE(req){
    return await AppControler.DELETE(req)
}