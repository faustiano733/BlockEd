import {sites} from "../db/models/sites.js";
import { Op } from "sequelize";


export async function getAllSites(){
    const all_sites = await sites.findAll()
    return all_sites
}

export async function deleteSite(site){
    const site_db = await getSite(site)
   
    await sites.destroy({
        where:{
            domine:site_db.dominio,
            idSchool:site_db.idSchool
        }});

    return JSON.stringify(site)
}

export async function createSite(site){
    const site_valido = await validarSite(site)
    if(site_valido){
    const novo_site = await sites.create({domine:site, idSchool:1})
     return novo_site;
    }else{
        return new TypeError("URL invalida")
    }
}


async function validarSite(url_site){
    let valido = false
    try{
    const resposta = await fetch("https://"+url_site)
    return true
}catch(erro){
    if(erro.message === "fetch failed"){
        return false
    }
    }
}

export async function getSite(site_dominio) {
    const site = await sites.findOne({
        where:{dominio:site_dominio}
    });

    if(site === null){
        return new TypeError("dominio invalido")
    }else{
        return site
    }
}

export async function getNumberOfSites(){
    const total_sites = await sites.count();
    return total_sites;
}
//console.log(await apagarSite("www.teste0.com"))