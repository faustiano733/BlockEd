import { NextResponse } from "next/server";
import { exceptionSchema } from "../validators/authValidator";
import { exception } from "../db/models";


export async function createException(new_exception,transaction){
    const {error} = exceptionSchema.validate(new_exception)
    if(error) throw new Error(error)
    return await exception.create(new_exception,transaction)
}

export async function getExceptionsService(idSchool){
    return await exception.findAll({where:{idSchool:idSchool}})
}

export async function deleteExceptionService(id,idSchool){
    return await exception.destroy({where:{
        id:id,
        idSchool:idSchool
    }})
}