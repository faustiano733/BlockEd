import {account} from "../db/models/account.js";
import {user} from "../db/models/user.js";
import {school} from "../db/models/school.js";
import {location} from "../db/models/location.js";
import { createSession } from "../session.js";
import { getSchool } from "./escolaService.js";

async function createAccount(new_account){
   
    if(new_account.email != undefined && new_account.password != undefined){
        
        const search_account = await getAccount(new_account.email)
        
        if(search_account.length === 0){

            const created_account = await account.create(new_account);
            return created_account;

        }else{
            throw new Error("Account Already Exists")
        }
        
    }else{
        throw new TypeError("Invalids attributes")
    }
}

async function createUser(new_user){
    if(new_user.nome != undefined && new_user.idConta !=undefined){
        const created_user = await  user.create(new_user);
        return created_user;
    }else{
        throw new TypeError("Invalid Attributes")
    }

    

}

async function createLocation(new_location){
    const created_location = await location.create(new_location)
    return created_location
}

async function createSchool(new_school){
    if(
      new_school.name != undefined && 
      new_school.idUser != undefined && 
      new_school.idLocation != undefined){

        const created_school = await school.create({...new_school,block_sites:0,block_apps:0,block_internet:0, block_cam:0});
        return created_school;
    }else{
        throw new TypeError("Invalid attributes")
    }
}

export async function siggin(account, user, school,location){
    try{
        const new_account = await createAccount(account)
        const new_user = await createUser({name:user,idConta:new_account.idAccount})
        const school_location = await createLocation(location)
        const new_school = await createSchool({name:school, idLocation:school_location.idLocation, idUser:new_user.idUser})
        return {message:"success"}
    }catch(error){
        if(error.name ==='TypeError'){
            throw new TypeError("Please validet the attributes")
        }else if(error.name === 'Error'){
            throw new Error('This account Already Exists')
        }
    }
}

async function getAccount(user_email){

    const finded_account = await account.findOne({
        where:{email:user_email}
    })
    return finded_account
}

async function getUser(user_name){
    const finded_user = await usuario.findAll({
        where:{nome:user_name}
    })

    return finded_user
}

export async function login(user_email, user_password){
    const user = await getAccount(user_email)
    if(user.email === user_email && user.password === user_password ){
        createSession(user.idUsuario)
        return true
    }else{
        return false
    }
}

export async function changeEmail(new_email){
    /*função que pega os cookies do navegador e pega o id da conta*/
    const user_id = '#UUID'
    const user = await usuario.findByPk(user_id)
    const edited_account = await conta.update({email:new_email},{where:{idConta:user.idConta}})
    return edited_account
}

export async function changePassword(new_password, old_password){
    /*função que pega dados do cookie e o id do usuario*/
    const user_id = '#UUID'
    const user = await usuario.findByPk(user_id)
    let account = await conta.findByPk(user.idConta)

    if(old_password === account.password){
        const edited_account = await conta.update({password:new_password},{where:{idConta:user.idConta}})
        return edited_account
    }
}

export async function changeLocation(new_location){
    
    const user_id = getAuthenticatedUser()
    const school = await getSchool(user_id)
    const changed_location = await location.update({...new_location},{where:{idLocalizacao:school.idLocalizacao}})

    return school
}
