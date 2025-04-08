import { NextResponse } from "next/server";
import { createSite, getAllSites } from "../services/siteServices";
import db from "../db/connection";


export async function getSitesController(req){
    const school_id = req.headers.get('x-school-id')
    const site = req.searchParams.get('site')
    const all_sites = await getAllSites(school_id)
    if(all_sites){
        return NextResponse.json(all_sites,{status:201})
    }
    return NextResponse.json(all_sites, {status:200})
}

/*

@

*/
export async function createSiteController(req){
    const idSchool = req.headers.get('x-school-id')
    const {url} = await req.json()
    const transaction = await db.sequelize.transaction()
    try{
        const new_site = await createSite({domain:url,idSchool:idSchool})
        console.log({...new_site,status:'Adicionado'})
    }catch(error){
        return NextResponse.json({error:error.message},{status:500})
    }finally{
        transaction.rollback()
    }
    
}