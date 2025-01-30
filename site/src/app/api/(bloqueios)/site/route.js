import { NextResponse } from "next/server";
import { createSite, getAllSites, deleteSite, getSite } from "../../../../lib/services/siteServices.js";



export async function GET() {
    const all_sites =  await getAllSites()
    return NextResponse.json(all_sites);
}

export async function DELETE(req){
    const request = await req.json();
    const site = await getSite(request.domine);
    deleteSite(site);
    
}


export async function POST(req){
    const novo_site = await req.json()
    const created_site = await createSite(novo_site);
    return NextResponse.json(created_site);
    
}