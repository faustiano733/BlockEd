import { siggin } from "@/lib/services/accountServices"
import { NextResponse } from "next/server"


export async function POST(req){
    const data = await req.json()
        if(data.user != undefined && data.account != undefined && data.school != undefined && data.localization != undefined){
            try{
                const sucess = await siggin(data.account,data.user,data.school,data.localization)
                return NextResponse.json(sucess)
                
            }catch(error){
                if(error instanceof TypeError && error.message === "Please validet the attributes"){
                    return NextResponse.error("Please validate this fields")
                }else if(error instanceof Error && error.message ==='This account Already Exists'){
                    return NextResponse.error('This account Alredy exists')
                }else{
                    return NextResponse.error('Something Went Wrong')
                }
                
            }
    
        } 
    
}