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