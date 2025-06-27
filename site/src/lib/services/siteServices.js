import {sites} from "../db/models.js";
import { Op } from "sequelize";
import { parse } from 'tldts';
import { siteSchema } from "../validators/authValidator.js";

export async function getAllSites(idSchool){
    return await sites.findAll({where:{idSchool:idSchool}})
}

export async function deleteSite(domain,idSchool){
  return await sites.destroy({
      where:{
          domain:domain,
          idSchool:idSchool
      }});

}

export async function createSite(site,transaction) {
    
  const {error} = siteSchema.validate(site)
    
  if(error) throw new Error(error)

  try {
    const novo_site = await sites.create(site,transaction);
    return novo_site;
  } catch (error) {
    throw error; 
  }
}

export async function validateSite(url_site) {
  try {
    // Adiciona protocolo se não existir
    if (!url_site.startsWith('http://') && !url_site.startsWith('https://')) {
      url_site = 'https://' + url_site;
    }

    // Parse da URL com tldts
    const parsed = parse(url_site);
    
    // Verifica se a URL tem estrutura válida
    if (!parsed.isIcann || !parsed.hostname) {
      return { isValid: false, error: 'Estrutura de URL inválida',status:404 };
    }

    // Verifica se é um domínio público (opcional)
    if (parsed.isPrivate) {
      return { isValid: false, error: 'Domínios privados não são permitidos',status:403 };
    }

    // Remove www. e protocolo para armazenamento consistente
    let normalizedUrl = parsed.hostname.replace(/^www\./, '');
    
    // Verificação adicional de conectividade (opcional)
    try {
      const resposta = await fetch(`https://${normalizedUrl}`, {
        method: 'HEAD', 
        timeout: 5000 
      });


      console.log("URL formatada", normalizedUrl);
      if(!normalizedUrl.startsWith("www.")){
        console.log("URL formatada 2", normalizedUrl);
        const attempt = await fetch(`https://www.${normalizedUrl}`, {
          method: 'HEAD', 
          timeout: 5000 
        })

        //console.log("resposta", attempt)

        if(attempt.ok || (!attempt.ok && attempt.redirected))
          normalizedUrl = "www." + normalizedUrl

      }    
      
      return { 
        isValid: true, 
        normalizedUrl,
        status: resposta.status 
      };
    } catch (fetchError) {
      console.error('Erro na validação do site:', fetchError.message)
      return { 
        isValid: false, 
        normalizedUrl,
        error: 'Domínio válido mas inacessível',
        status:202
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

export async function getNumberOfSites(idSchool){
    const total_sites = await sites.count({
      where:{
        idSchool: idSchool
      }
    });
    return total_sites;
}