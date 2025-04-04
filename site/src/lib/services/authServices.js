import bcrypt from "bcryptjs";
import { createAccount, getAccount } from "./accountServices.js"
import { createLocation } from "./locationService.js";
import { createSchool, getSchool } from "./schoolServices.js";
import { createUser, getUser } from "./userServices.js";
import { SignJWT,jwtVerify } from "jose";
import db from "../db/connection.js";

const secretKey =  new TextEncoder().encode(process.env.SECRET_KEY);
const TOKEN_EXPIRATION = '90h';
const SALT_ROUNDS = 12;
  
export const signup = async (accountData, userData, schoolData, locationData)=>{
  
  const transaction = await db.sequelize.transaction()
    try{
      accountData.password = await hashPassword(accountData.password)
        const newAccount = await createAccount(accountData, {'transaction':transaction});
        const newUser = await createUser({...userData,idAccount:newAccount.id},{'transaction':transaction})
        const newSchool = await createSchool({...schoolData, idUser:newUser.id},{'transaction':transaction})
        const newLocation = await createLocation({...locationData, idSchool:newSchool.id},{'transaction':transaction});
        await transaction.commit()
        return {status:'ok'}
    }catch(error){
        await transaction.rollback()
        console.log(error)
        throw error
    }
    
}

// Erros personalizados
class InvalidCredentialsError extends Error {
  constructor() {
    super('Credenciais inválidas');
    this.name = 'InvalidCredentialsError';
  }
}

class TokenVerificationError extends Error {
  constructor() {
    super('Token inválido ou expirado');
    this.name = 'TokenVerificationError';
  }
}

export const loginService = async (email, password) => {
  try {
   
    const account = await getAccount(email);
    if (!account) {
      throw new InvalidCredentialsError();
    }
    const isValidPassword = await bcrypt.compare(password, account.password);
    if (!isValidPassword) {
      throw new InvalidCredentialsError();
    }
    const user = await getUser(account.id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    const school = await getSchool(user.id);
    if (!school) {
      throw new Error('Escola não encontrada');
    }

    // Criação do token
    const token = await new SignJWT({ 
      userId: user.id,
      schoolId: school.id
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(TOKEN_EXPIRATION)
      .sign(secretKey);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: account.email,
        role: user.role
      },
      school: {
        id: school.id,
        name: school.name
      }
    };
    
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Função auxiliar para hash de senha (útil para cadastro)
export const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};