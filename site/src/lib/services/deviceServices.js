import { device } from "../db/models"
import { deviceSchema } from "../validators/authValidator"

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