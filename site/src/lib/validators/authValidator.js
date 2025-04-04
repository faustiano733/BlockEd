import Joi from 'joi';

export const accountSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const userSchema = Joi.object({
  name: Joi.string().required(),
  idAccount: Joi.string().max(36).required(),
});

export const locationSchema = Joi.object({
    longitude:Joi.string().required(),
    latitude:Joi.string().required(),
    idSchool:Joi.string().max(36).required()
});

export const schoolSchema = Joi.object({
  name: Joi.string().required(),
  idUser: Joi.string().max(36).required(),
  blockSites:Joi.bool().required(),
  blockCam:Joi.bool().required(),
  blockApps:Joi.bool().required(),
  blockInternet:Joi.bool().required()
});

export const studentSchema = Joi.object({
  name: Joi.string().required(),
  idSchool: Joi.string().max(36).required()
})

export const deviceSchema = Joi.object({
  idStudent:Joi.string().max(36).required(),
  UID:Joi.string().required()
})

export const exceptionSchema = Joi.object({
  date:Joi.date().required(),
  idSchool:Joi.string().max(36).required()
})