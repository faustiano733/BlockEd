import { getDashboard } from "@/lib/services/dashboardService.js";
import { NextResponse } from "next/server";
import {getAllAttempts} from "@lib/services/attemptServices";
import {getNumberOfApps} from "@lib/services/appServices";
import {getNumberOfDevices} from "@lib/services/deviceServices";
import {getNumberOfStudents} from "@lib/services/studentService";
import {getNumberOfSites} from "@lib/services/siteServices";
import {getNumberOfAttemptsDate} from "@lib/services/attemptServices";


export async function GET(req){
    //const dashboard = await getDashboard()
    const user  = req.headers.get('x-user-id')
    const school = req.headers.get('x-school-id')

    let days = lineData();

    days.map(async(el, index)=>{
        days[index] = await getNumberOfAttemptsDate(el, school);
    })
    
    return NextResponse.json({
        apps: await getNumberOfApps(school),
        devices: await getNumberOfDevices(school),
        students: await getNumberOfStudents(school),
        sites: await getNumberOfSites(school),
        days: days
    })
}



    function lineData(){
        let now = new Date();
        let response = [];

        for(let i = 0; i < 7; i++){
            if(i!=0){
                now.setDate(now.getDate() - 1)
            }

            let d = now.getDate() < 10 ? "0"+now.getDate() : now.getDate();
            let m = now.getMonth() + 1 < 10 ? "0"+(now.getMonth() + 1) : now.getMonth();
            let y = now.getFullYear();


            response = [(y+"-"+m+"-"+d), ...response]
        }

        return response;
    }