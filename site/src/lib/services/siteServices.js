import {sites} from "../db/models.js";
import { Op } from "sequelize";
import { parse } from 'tldts';
import { siteSchema } from "../validators/authValidator.js";


export async function getAllSites(idSchool){
    return await sites.findAll({where:{idSchool:idSchool}})
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

export async function createSite(site,transaction) {
    
    const {error} = siteSchema.validate(site)
    
    if(error) throw new Error(error)

    const {domain,idSchool} = site
    
  try {
    // Normaliza e valida a URL
    const { normalizedUrl, isValid,error } = await validateSite(domain);
    
    if (!isValid) {
      throw new Error(error);
    }

    const novo_site = await sites.create({
      domain: normalizedUrl,
      idSchool: idSchool
    },transaction);

    return novo_site;
  } catch (error) {
    throw error; 
  }
}

async function validateSite(url_site) {
  try {
    // Adiciona protocolo se não existir
    if (!url_site.startsWith('http://') && !url_site.startsWith('https://')) {
      url_site = 'https://' + url_site;
    }

    console.log(url_site)

    // Parse da URL com tldts
    const parsed = parse(url_site);
    console.log(parsed)
    // Verifica se a URL tem estrutura válida
    if (!parsed.isIcann || !parsed.hostname) {
      return { isValid: false, error: 'Estrutura de URL inválida' };
    }

    // Verifica se é um domínio público (opcional)
    if (parsed.isPrivate) {
      return { isValid: false, error: 'Domínios privados não são permitidos' };
    }

    // Remove www. e protocolo para armazenamento consistente
    const normalizedUrl = parsed.hostname.replace(/^www\./, '');

    // Verificação adicional de conectividade (opcional)
    try {
      const resposta = await fetch(`https://${normalizedUrl}`, {
        method: 'HEAD', // Mais eficiente que GET
        redirect: 'error', // Não seguir redirecionamentos
        timeout: 5000 // Timeout de 5 segundos
      });
      
      return { 
        isValid: true, 
        normalizedUrl,
        status: resposta.status 
      };
    } catch (fetchError) {
      // Ainda consideramos válido se o domínio estiver correto, mesmo que offline
      return { 
        isValid: false, 
        normalizedUrl,
        error: 'Domínio válido mas inacessível' 
      };
    }

  } catch (error) {
    console.error('Erro na validação do site:', error);
    return { 
      isValid: false, 
      error: error.message || 'Erro desconhecido na validação' 
    };
  }
}

export async function getSite(site_dominio) {
    const site = await sites.findOne({
        where:{domain:site_dominio}
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