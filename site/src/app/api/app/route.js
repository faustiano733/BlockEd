import { NextResponse } from "next/server.js"
import {getApp, activeApp, addApp, getAllApps} from "@lib/services/appServices.js"
import {getAllSites} from "@lib/services/siteServices";
import {getSchoolFromId} from "@lib/services/schoolServices";
import {getLocation} from "@lib/services/locationService";
import {compareCode, getSchoolCode} from "@lib/services/schoolCodeService";
import {createStudentController} from "@lib/controllers/studentController";
import {getExceptionsService} from "@lib/services/exceptionService";
import {EncryptJWT, jwtDecrypt} from "jose";

export async function GET(req){
    const params = new URL(req.url).searchParams
    const result = await getSchoolCode(params.get("code"))

    if(!result) return NextResponse.json({success: false, error: "Código inexistente"})
    if(!(result.expiresAt >= new Date())) return NextResponse.json({success: false, error: "Token expirado"})



    let apps = await getAllApps(result.idSchool);
    let sites = await getAllSites(result.idSchool) 
    let {blockSites, blockApps, blockCam, blockInternet} =  await getSchoolFromId(result.idSchool);
    let {latitude, longitude, radius} = await getLocation(result.idSchool);
    let schoolData = {blockSites, blockApps, blockCam, blockInternet};
    let exceptions = await getExceptionsService(result.idSchool)
    apps.map((app, index)=>{
        apps[index] = app.packageName
    })

    sites.map((domain, index)=>{
        sites[index] = domain.domain
    })

    exceptions.map((exception, index)=>{
        let m = (exception.date.getMonth() + 1) < 10 ?  "0"+(exception.date.getMonth() + 1) : (exception.date.getMonth() + 1)
        let d = exception.date.getDate() < 10 ?  "0"+exception.date.getDate() : exception.date.getDate()
        exceptions[index] = (d + "/" + m)
    })
    
    return NextResponse.json({
        success: result.expiresAt >= new Date(), 
        block_internet: blockInternet ? 1 : 0,
        block_cam: blockCam ? 1 : 0,
        block_apps: blockApps ? 1 : 0,
        block_sites: blockSites ? 1 : 0,
        apps, 
        domains: sites, 
        latitude,
        longitude,
        raio: radius,
        exceptions
    })
}

export async function POST(req){
    const dados = await req.json();
    const name = dados.name;
    const birthday = dados.birthday;
    const model = dados.model;
    const UID = dados.UID;

    console.log("Vrau cotas"+birthday);
    const result = await getSchoolCode(dados.code);

    if(!result) return NextResponse.json({success: false, error: "Código inexistente"})
    if(!(result.expiresAt >= new Date())) return NextResponse.json({success: false, error: "Token expirado"})

    const new_student = await createStudentController(result.idSchool, {name, birthday}, {model, UID});
    console.log("Estudante criado: "+new_student);

    const chave = new TextEncoder().encode("12345678901234567890123456789012");
    const token = await new EncryptJWT({idSchool: result.idSchool, idDevice: new_student.idDevice, idStudent: new_student.idStudent})
    .setProtectedHeader({alg: "dir", enc: "A256GCM"})
    .encrypt(chave);

    console.log("Token criado:" +   token) 

    let apps = await getAllApps(result.idSchool);
    let sites = await getAllSites(result.idSchool) 
    let {blockSites, blockApps, blockCam, blockInternet} =  await getSchoolFromId(result.idSchool);
    let {latitude, longitude, radius} = await getLocation(result.idSchool);
    let schoolData = {blockSites, blockApps, blockCam, blockInternet};
    let exceptions = await getExceptionsService(result.idSchool)
    apps.map((app, index)=>{
        apps[index] = app.packageName
    })

    sites.map((domain, index)=>{
        sites[index] = domain.domain
    })

    exceptions.map((exception, index)=>{
        let m = (exception.date.getMonth() + 1) < 10 ?  "0"+(exception.date.getMonth() + 1) : (exception.date.getMonth() + 1)
        let d = exception.date.getDate() < 10 ?  "0"+exception.date.getDate() : exception.date.getDate()
        exceptions[index] = (d + "/" + m)
    })
    
    return NextResponse.json({
        success: result.expiresAt >= new Date(),
        token,
        block_internet: blockInternet ? 1 : 0,
        block_cam: blockCam ? 1 : 0,
        block_apps: blockApps ? 1 : 0,
        block_sites: blockSites ? 1 : 0,
        apps, 
        domains: sites, 
        latitude,
        longitude,
        raio: radius,
        exceptions
    })
}

export async function PUT(req){
    const dados = await req.json();
    const token = dados.token;
    const attempts = dados.attempts;

    const chave = new TextEncoder().encode("12345678901234567890123456789012");
    let result;
    try {
        const  {payload, protectedHeader} = await jwtDecrypt(token, chave)
        result = payload;
    } catch(error){
        NextResponse.json({success: false, error: "Erro no token armazenado"});
    }

    let apps = await getAllApps(result.idSchool);
    let sites = await getAllSites(result.idSchool) 
    let {blockSites, blockApps, blockCam, blockInternet} =  await getSchoolFromId(result.idSchool);
    let {latitude, longitude, radius} = await getLocation(result.idSchool);
    let schoolData = {blockSites, blockApps, blockCam, blockInternet};
    let exceptions = await getExceptionsService(result.idSchool)
    apps.map((app, index)=>{
        apps[index] = app.packageName
    })

    sites.map((domain, index)=>{
        sites[index] = domain.domain
    })

    exceptions.map((exception, index)=>{
        let m = (exception.date.getMonth() + 1) < 10 ?  "0"+(exception.date.getMonth() + 1) : (exception.date.getMonth() + 1)
        let d = exception.date.getDate() < 10 ?  "0"+exception.date.getDate() : exception.date.getDate()
        exceptions[index] = (d + "/" + m)
    })
    
    return NextResponse.json({
        success: true,
        block_internet: blockInternet ? 1 : 0,
        block_cam: blockCam ? 1 : 0,
        block_apps: blockApps ? 1 : 0,
        block_sites: blockSites ? 1 : 0,
        apps, 
        domains: sites, 
        latitude,
        longitude,
        raio: radius,
        exceptions
    })


    return NextResponse.json({success: true});

}