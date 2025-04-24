import { createSiteController, getSitesController, SiteController } from "@/lib/controllers/siteController";

export async function GET(req){
    return await SiteController.GET(req)
}

export async function DELETE(req){
    return await SiteController.DELETE(req)
}


export async function POST(req){    
    return await createSiteController(req)
}