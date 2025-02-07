import { Op } from "sequelize";
import {students} from "../db/models/student.js";
import { device } from "../db/models/device.js";

export async function createStudent(new_student){
    const added_student = await students.create({...new_student});
    return added_student;
}

export async function createDevice(new_device){
    const added_device = await device.create(new_device)
    return added_device
}

export async function linkDevice(student,device){
    const linked_device = await createDevice({...device,idStudent:student.idStudent})
    return linked_device
}

export async function getAllStudents(){
    
    const db_students = await students.findAll();
    /*let list_students = []

    db_students.forEach(async student=>{
        
        const student_information = await pegaInformacoesAluno(student.name)
        list_students = [...list_students, student_information]
        
    })
    */
    let list_students = db_students;
    for(let i = 0; i<list_students.length;i++){
        list_students[i] = await getStudentInformation(list_students[i].name);
    }
    return list_students
}

async function getStudent(student_name){
    const student = await students.findOne({
        where:{
            name:student_name
        }
    });
    if(student === null){
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

export async function getNumberOftudents(){
    const number_of_students = await students.count()
    return number_of_students
}

async function getAllDevices(idStudent_list){
    const all_devices_list = await device.findAll({
        where:{
            idStudent:idStudent_list
        }
    })
    return all_devices_list
}

export async function getStudentInformation(student_name){
    
    const student = await getStudent(student_name);

    const student_devices = await getAllDevices(student.idStudent);

    const student_information = {
        name:student.name,
        tot_devices:student_devices.length,
        devices:student_devices
    }

    return student_information
}