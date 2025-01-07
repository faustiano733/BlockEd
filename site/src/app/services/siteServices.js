import { NextResponse } from "next/server.js";
import sites from "../db/models/sites.js";
import { Op } from "sequelize";


export async function pegaTodosSites(){
    const todos_sites = await sites.findAll({attributes:{
        exclude:["escola_id"]
    }})
    return todos_sites
}

export async function apagarSite(site){
    const site_db = await pegarSite(site)
    await sites.destroy({
        where:{
            [Op.and]:[{dominio:site_db.dominio},{escola_id:site_db.escola_id}]
        }
    });
    return JSON.stringify(site)
}

export async function criarSite(site){
    const site_valido = await validarSite(site)
    if(site_valido){
    const novo_site = await sites.create({dominio:site, escola_id:1})
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

export async function pegarSite(site_dominio) {
    const site = await sites.findOne({
        where:{dominio:site_dominio}
    });

    if(site === null){
        return new TypeError("dominio invalido")
    }else{
        return site
    }
}

console.log(await apagarSite("www.teste0.com"))