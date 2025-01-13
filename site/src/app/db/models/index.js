import apps from "./apps.js";
import sites from "./sites.js"
import alunos from "./alunos.js";
import escolas from "./escolas.js"
import dispositivos from "./dispositivos.js"
import usuarios from "./usuarios.js"
import contas from "./contas.js"
import localizacao from "./localizacao.js";


import db from "./helpers/connection.js";
import { tentativas_app } from "./tentativas_app.js";

const aluno_teste = [
    {
        nome:"Faustiano",
        escola_id:1
    },
    {
        nome:"Hugo",
        escola_id:2
    }
]

const apps_teste = [
    {
        nome:"TikTok",
        package_name:"tiktok.package",
        escola_id:1
    },
    {
        nome:"TikTok",
        package_name:"tiktok.package",
        escola_id:2
    }
]

const conta_teste = [
    {
        email:"teste@gmail.com",
        password:"sajsjalksj"
    },
    {
        email:"teste2@gmail.com",
        password:"sajsjalksj"
    }
]

const dispositivo_teste = [
    {
        aluno_id:1,
        mac_adrress:"122345",
        ultima_conexao:"10 DIAS"
    },
    {
        aluno_id:2,
        mac_adrress:"122345",
        ultima_conexao:"12 DIAS"
    }
]

const escola_teste = [
    {
        nome:"DDF",
        block_sites:1,
        block_apps:1,
        block_internet:1,
        block_cam:1,
        user_id:1,
        localizacao_id:1
    },
    {
        nome:"Girassol",
        block_sites:1,
        block_apps:2,
        block_internet:1,
        block_cam:1,
        user_id:1,
        localizacao_id:2
    }
]

const localizacao_teste = [
    {
        longitude:10.234,
        latitude:10.256
    },
    {
        longitude:10.234,
        latitude:10.256
    },
]


const sites_teste = [
    {
    dominio:"www.teste.com",
    escola_id:1
    },
    {
        dominio:"www.teste2.com",
        escola_id:1
    },
    {
        dominio:"www.teste3.com",
        escola_id:1
    },
]

const usuario_teste =[
    {
        user_name:"faustiano",
        conta_id:1
    },
    {
        user_name:"faustiano",
        conta_id:2
    }
]

const tentiva_app_teste = [
    {
        id_app:3,
        id_aluno:1,
        id_escola:1
    },
    {
        id_app:3,
        id_aluno:1,
        id_escola:1
    },
]

async function dadosTeste(){
    //await Promise.all(
    //    aluno_teste.map(async aluno=>{
    //        await alunos.create(aluno)
    //    })
    //)
//
    //await Promise.all(
    //    apps_teste.map(async app=>{
    //        await apps.create(app)
    //    })
    //)
//
    //await Promise.all(
    //    conta_teste.map(async conta=>{
    //        await contas.create(conta)
    //    })
    //)
//
    //await Promise.all(
    //    dispositivo_teste.map(async dispositivo=>{
    //        dispositivos.create(dispositivo)
    //    })
    //)
//
    //await Promise.all(
    //    escola_teste.map(async escola=>{
    //        await escolas.create(escola)
    //    })
    //)
//
    //await Promise.all(
    //    localizacao_teste.map(async localizador=>{
    //        await localizacao.create(localizador)
    //    })
    //)
//
    //await Promise.all( 
    //    sites_teste.map(async site=>{
    //        await sites.create(site)
    //    })
    //)
//
    //await Promise.all(
    //    usuario_teste.map(async usuario=>{
    //        usuarios.create(usuario)
    //    })
    //)

    const data_actual = new Date()
        data_actual.setDate( data_actual.getDate() -5)
        tentiva_app_teste.map(async tentativa=>{
            await tentativas_app.create({...tentativa, teste_tentativas_data:data_actual})
        })
    

}

await db.sequelize.sync({alter:true})
await dadosTeste()


//db.sequelize.drop()