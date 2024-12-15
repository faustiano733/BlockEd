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
    await sites.destroy({
        where:{
            [Op.and]:[{dominio:site.dominio},{escola_id:site.escola_id}]
        }
    });
}

export async function criarSite(site){
    const novo_site = await sites.create(site)
     return novo_site;
}

export async function editarSite(edicoes){
    const site_editado = await sites.update(edicoes,{
        where:{
            dominio:edicoes.dominio
        }
    });

    return site_editado;
}

export async function pegarSite(site_dominio) {
    const site = await sites.findOne({
        where:{dominio:site_dominio}
    });

    return site;
}