import { deleteApp, getAllApps, getApp, addApp } from "../services/appServices"
import { NextResponse } from "next/server"


const GET = async (req)=>{
    let response = ""
    const idSchool = req.headers.get('x-school-id')
    
    const url = new URL(req.url)
    
    const param = url.searchParams.get("app")
    
    if(!(!param)){
        const app = await getApp(param)
        response = app        
    }else{
        const all_apps_list = await getAllApps(idSchool)
        response = all_apps_list
    }

    return NextResponse.json(response)
}


const DELETE = async (req)=>{
    
    const {id, name} = await req.json()
    const idSchool = await req.headers.get('x-school-id')
    
    try{
        if(!id || !name) return NextResponse.json({error:'id e nome são obrigatorios'},{status:422})
     
       const isDeleted = await deleteApp({id,name,idSchool})
        
        if (isDeleted) return NextResponse.json({status:201})
        
        return NextResponse.json({status:403})
    
    }catch(error){
        return NextResponse.json({error:'Alguma Coisa Correu Mal'},{status:500})
    }
}

const POST = async (req)=>{
    const request = await req.json()
    const idSchool = req.headers.get('x-school-id')
    const name = request.name
    const packageName = request.package

    const app = await addApp(name, packageName,idSchool)
    console.log(JSON.stringify(app))
    return NextResponse.json(app)
}


const AppControler = {DELETE:DELETE,POST:POST,GET:GET}

export default AppControler