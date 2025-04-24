import { NextResponse } from "next/server";
import { createSite, deleteSite, getAllSites } from "../services/siteServices";
import db from "../db/connection";
import { deleteApp } from "../services/appServices";


const GET = async (req)=>{
    const school_id = req.headers.get('x-school-id')
    const url = new URL(req.url)
    const site = url.searchParams.get('site')
    const all_sites = await getAllSites(school_id)
    if(!all_sites){
        return NextResponse.json(all_sites,{status:201})
    }
    return NextResponse.json(all_sites, {status:200})
}

/*

@

*/
export async function createSiteController(req){
    const idSchool = req.headers.get('x-school-id')
    const {domain} = await req.json()
    const transaction = await db.sequelize.transaction()
    try{
        const new_site = await createSite({domain:domain,idSchool:idSchool})
        await transaction.commit()
        return NextResponse.json({...new_site},{status:201})
    }catch(error){
        await transaction.rollback()
        return NextResponse.json({error:error.message},{status:500})
    }
    
}

const DELETE = async (req)=>{
    const {id, domain} = await req.json()
    const idSchool = await req.headers.get('x-school-id')
    try{
        if(!id || !domain) return NextResponse.json({error:'id e nome são obrigatorios'},{status:422})
        await deleteSite(domain,idSchool)
        return NextResponse.json({status:201})
    }catch(error){
        return NextResponse.json({error:'Alguma Coisa Correu Mal'},{status:500})
    }
}

export const SiteController = {GET,DELETE}