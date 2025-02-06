import {device} from "../db/models/device.js";
import { getNumberOfApps } from "./appServices.js";
import { getAllStudents, getNumberOftudents } from "./studentService.js";
import { getBlockedApps, getBlocksWeek } from "./blockServices.js";
import { getNumberOfSites } from "./siteServices.js";
//import { students } from "../db/models/student.js";

async function getNumberOfDevices(){
    const tot_devices = await device.count()
    return tot_devices
}

export async function getDashboard(){


    const blocks_week = await getBlocksWeek()
    const tot_students = await getNumberOftudents()
    const tot_devices = await getNumberOfDevices()()
    const tot_apps = await getNumberOfApps()
    const tot_sites = await getNumberOfSites()
    const blocked_apps = await getBlockedApps()
    let all_students_list = await getAllStudents()
    const dashboard = {
        week:blocks_week,
        numberStudents:tot_students,
        numberDevices:tot_devices,
        numberApps:tot_apps,
        numberSites:tot_sites,
        apps:blocked_apps,
        students:all_students_list
    }

    return dashboard

}