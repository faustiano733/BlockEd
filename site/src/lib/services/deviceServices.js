import { device } from "../db/models"
import { deviceSchema } from "../validators/authValidator"
import { getAllStudents } from "@lib/services/studentService";

export async function getAllDevices(idStudent){
    const all_devices_list = await device.findAll({
        where:{
            idStudent:idStudent
        }
    })
    return all_devices_list
}

export async function createDevice(new_device, transaction){
    const {error} =   deviceSchema.validate(new_device)
    
    if(error) throw new TypeError(error)
    
    return await device.create(new_device, transaction)
}

export async function getNumberOfDevices(idSchool){
    const students = await getAllStudents(idSchool);

    let n = 0;

    students.map(async(st, index)=>{
        n += st.devices.length;
    })

    return n;
}

export async function getNumberOfDevicesStudent(idStudent){
    return await device.count({
        where:{
            idStudent: idStudent
        }
    })
}