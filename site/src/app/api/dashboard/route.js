import { getDashboard } from "@/lib/services/dashboardService.js";
import { NextResponse } from "next/server";


export async function GET(){
    const dashboard = await getDashboard()
    return NextResponse.json(dashboard)
}