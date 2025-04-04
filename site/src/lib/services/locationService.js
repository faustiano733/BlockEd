import { location } from '../db/models.js';
import { locationSchema } from '../validators/authValidator.js';

export const createLocation = async (newLocation,transaction) => {
  const { error } = locationSchema.validate(newLocation);
  if (error) throw new TypeError('Dados da localização inválidos');

  return await location.create(newLocation, transaction);
};