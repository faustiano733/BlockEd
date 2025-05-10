import { NextResponse } from "next/server.js"
import {getSchool, updateSchoolOptions} from "@lib/services/schoolServices.js"


export async function GET(req){
    const userId = req.headers.get('x-user-id');
    const {blockSites, blockApps, blockCam, blockInternet} = await getSchool(userId);

    return NextResponse.json({blockSites, blockApps, blockInternet, blockCam});
}

export async function PUT(req){
    const userId = req.headers.get('x-user-id');
    const {options} = await req.json();

    const {error} = await updateSchoolOptions(userId, options);
    const {blockSites, blockApps, blockCam, blockInternet} = await getSchool(userId);

    return NextResponse.json({error, updates: {blockSites, blockApps, blockCam, blockInternet}});
}





