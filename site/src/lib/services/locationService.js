import { location } from '../db/models.js';
import { locationSchema } from '../validators/authValidator.js';

export const createLocation = async (newLocation,transaction) => {
  const { error } = locationSchema.validate(newLocation);
  if (error) throw new TypeError('Dados da localização inválidos');

  return await location.create(newLocation, transaction);
};

export async function getLocation(idSchool){
  return await location.findOne({where:{idSchool:idSchool}}) 
}

export async function alterLocationService(newLocation){
  console.log(newLocation)
  const {error} = locationSchema.validate(newLocation)
  if(error) throw TypeError('Dados localização Invalidos')
  return await location.update(newLocation,{where:{idSchool:newLocation.idSchool}})
  
}