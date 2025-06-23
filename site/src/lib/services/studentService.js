import {students} from "../db/models.js";
import { studentSchema } from "../validators/authValidator.js";
import { getAllDevices } from "./deviceServices.js";
import db from "../db/connection";

export async function createStudent(new_student, transaction){
    const {error} = studentSchema.validate(new_student)
    if(error) throw new TypeError(error)
    return await students.create(new_student, transaction);
}

export async function createDevice(new_device){
    const added_device = await device.create(new_device)
    return added_device
}

export async function linkDevice(student,device){
    const linked_device = await createDevice({...device,idStudent:student.idStudent})
    return linked_device
}

export async function getAllStudents(idSchool){
    
    const db_students = await students.findAll({where:{idSchool:idSchool}});
    if(!db_students){
        return []
    }
    
    const list_students = await Promise.all(db_students.map(async student=>{
        const devices = await getAllDevices(student.id)
        return {id:student.id, name:student.name, devices:devices}
    }))

    return list_students
}

async function getStudent(student_id){
    const student = await students.findOne({
        where:{
            id:student_id
        }
    });
    if(student){
        return student;
    }else{
        throw new Error('student not found')
}}

export async function editStudent(changes){
    const edited_student = students.update(changes,{
        where:{
            id:changes.id
        }
    });

    return edited_student

}

export async function deleteStudent(student){
    await alunos.destroy({
        where:{
            idStudent:student.idStudent,
            name:student.name
        }
    })
}

export async function getNumberOfStudents(idSchool){
    const number_of_students = await students.count({
        where:{
            idSchool
        }
    })
    return number_of_students
}

export async function getStudentInformation(student_id){
    
    const student = await getStudent(student_id);
    console.log(student)
    const student_devices = await getAllDevices(student.id);

    const student_information = {
        id:student.id,
        name:student.name,
        birthday:student.birthday,
        uninstall: student.uninstall,
        tot_devices:student_devices.length,
        devices:student_devices
    }

    return student_information
}

export async function getNormalStudents(idSchool){
    const cincoDiasAtras = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

    const [results] = await db.sequelize.query(`
        SELECT COUNT(*) AS total
        FROM students s
        WHERE (
            SELECT d."updatedAt"
            FROM devices d
            WHERE d."idStudent" = s.id
            ORDER BY d."updatedAt" ASC
            LIMIT 1
        ) >= ? and "idSchool" = ?
    `, {
        replacements: [cincoDiasAtras, idSchool], // ex: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        type: db.sequelize.QueryTypes.SELECT,
    });

    return results.total;
}

export async function getAlertStudents(idSchool){
    const cincoDiasAtras = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [results] = await db.sequelize.query(`
        SELECT COUNT(*) AS total
        FROM students s
        WHERE (
            SELECT d."updatedAt"
            FROM devices d
            WHERE d."idStudent" = s.id
            ORDER BY d."updatedAt" ASC
            LIMIT 1
        ) >= ? and  

        (
            SELECT d."updatedAt"
            FROM devices d
            WHERE d."idStudent" = s.id
            ORDER BY d."updatedAt" ASC
            LIMIT 1
        ) < ? and "idSchool" = ?
    `, {
        replacements: [seteDiasAtras, cincoDiasAtras, idSchool], // ex: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        type: db.sequelize.QueryTypes.SELECT,
    });

    return results.total;
}

export async function getSuspectStudents(idSchool){
    //const cincoDiasAtras = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [results] = await db.sequelize.query(`
        SELECT COUNT(*) AS total
        FROM students s
        WHERE (
            SELECT d."updatedAt"
            FROM devices d
            WHERE d."idStudent" = s.id
            ORDER BY d."updatedAt" ASC
            LIMIT 1
        ) < ? and "idSchool" = ?
    `, {
        replacements: [seteDiasAtras, idSchool], // ex: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        type: db.sequelize.QueryTypes.SELECT,
    });

    return results.total;
}


