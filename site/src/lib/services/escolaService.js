import { school } from "../db/models/school.js";


export async function getSchool(user_id){
    const school = await school.findOne({where:{idUsuario:user_id}})
    return school
}