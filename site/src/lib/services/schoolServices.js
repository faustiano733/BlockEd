// src/services/schoolService.js
import { school } from '../db/models.js';
import { schoolSchema } from '../validators/authValidator.js';

export const createSchool = async (newSchool, transaction) => {
  const { error } = schoolSchema.validate(newSchool);
  if (error) throw new TypeError('Invalid School data');

  return await school.create(newSchool
    ,transaction);
};

export const getSchool = async (idUser)=>{
  return await school.findOne({where:{idUser:idUser}})
}

export const updateSchoolOptions = async (idUser, options)=>{
  return await school.update(options, {where: {idUser: idUser}})
}

export const getSchoolFromId = async (idSchool)=>{
  return await school.findOne({where:{id:idSchool}})
}