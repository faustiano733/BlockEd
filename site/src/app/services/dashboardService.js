import dispositivo from "../db/models/dispositivos.js";
import { pegaTotalApps } from "./appServices.js";
import { pegarAlunos, pegaTotalAlunos } from "./alunoService.js";
import { getBlocksWeek, pegaAppsTentados } from "./tentativaServices.js";
import { pegaTotalSites } from "./siteServices.js";

async function pegaTotalDispositivos(){
    const total_dispositivos = await dispositivo.count()
    return total_dispositivos
}

export async function pegaInformacoesDashboard(){


    const total_tentativas_semana = await getBlocksWeek()
    const total_alunos = await pegaTotalAlunos()
    const total_dispositivos = await pegaTotalDispositivos()
    const total_apps = await pegaTotalApps()
    const total_sites = await pegaTotalSites()
    const apps_tentados = await pegaAppsTentados()
    let lista_alunos = await pegarAlunos()
    const dashboard = {
        semana:total_tentativas_semana,
        alunos:total_alunos,
        dispositivos:total_dispositivos,
        apps:total_apps,
        sites:total_sites,
        apps_tentados:apps_tentados,
        lista_alunos:lista_alunos
    }

    return dashboard

}



//const teste = await pegaTotalTentivasSemana()

//console.log(teste)