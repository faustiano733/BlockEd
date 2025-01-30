import { pegaInformacoesDashboard } from "@/lib/services/dashboardService.js";
import { NextResponse } from "next/server";


export async function GET(){
    const dashboard = await pegaInformacoesDashboard()
    return NextResponse.json(dashboard)
}