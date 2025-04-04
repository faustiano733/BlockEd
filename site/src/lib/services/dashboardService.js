import { device} from "../db/models.js";
import { getNumberOfApps } from "./appServices.js";
import { getAllStudents, getNumberOfStudents } from "./studentService.js";
import { getNumberOfSites } from "./siteServices.js";
import { getBlocksWeek } from "./blockServices.js";

async function getNumberOfDevices(){
    const tot_devices = await device.count()
    return tot_devices
}

export async function getDashboard(){

    const blocks_week = await getBlocksWeek()
    const tot_students = await getNumberOfStudents()
    const tot_devices = await getNumberOfDevices()
    const tot_apps = await getNumberOfApps()
    const tot_sites = await getNumberOfSites()
    let all_students_list = await getAllStudents()
    const dashboard = {
        week:blocks_week,
        numberStudents:tot_students,
        numberDevices:tot_devices,
        numberApps:tot_apps,
        numberSites:tot_sites,
        students:all_students_list
    }

    return dashboard

}