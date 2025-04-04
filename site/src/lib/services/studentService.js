import {students} from "../db/models.js";
import { studentSchema } from "../validators/authValidator.js";
import { getAllDevices } from "./deviceServices.js";

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
        throw new Error('student not found')
    }else{
        return student;
}}

export async function editStudent(changes){
    const edited_student = students.update(changes,{
        where:{
            idStudent:changes.idStudent
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

export async function getNumberOfStudents(){
    const number_of_students = await students.count()
    return number_of_students
}

export async function getStudentInformation(student_id){
    
    const student = await getStudent(student_id);
    console.log(student)
    const student_devices = await getAllDevices(student.id);

    const student_information = {
        name:student.name,
        tot_devices:student_devices.length,
        devices:student_devices
    }

    return student_information
}