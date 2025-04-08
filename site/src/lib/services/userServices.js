// src/services/userService.js
import { user } from '../db/models.js';
import { userSchema } from '../validators/authValidator.js';

export const createUser = async (newUser,transaction) => {
  const { error } = userSchema.validate(newUser);
  if (error) throw new TypeError(error);

  return await user.create(newUser,transaction);
};

export const getUser = async (idAccount)=>{
  return await user.findOne({where:{idAccount:idAccount}})
}

export async function getUserById(id) {
  return await user.findByPk(id)
}

export async function updateName({name,id}, transaction){
  return await user.update({name:name},{where:{id:id}},transaction)
}