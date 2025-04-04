import { getDashboard } from "@/lib/services/dashboardService.js";
import { NextResponse } from "next/server";


export async function GET(req){
    //const dashboard = await getDashboard()
    const user  = req.headers.get('x-user-id')
    
    return NextResponse.json('faustiano')
}