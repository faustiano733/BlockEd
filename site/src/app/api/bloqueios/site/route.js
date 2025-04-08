import { createSiteController, getSitesController } from "@/lib/controllers/siteController";

export async function GET(req){
    return await getSitesController(req)
}

export async function DELETE(req){

    
}


export async function POST(req){
    
    return createSiteController(req)
}