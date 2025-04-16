import db from "../db/connection"
import { schoolCode } from "../db/models"

function generateSchoolCode(){
    const chars = 'ABCDEFGHJKLMNPQESTUVWXYZ23456789'
    let code = ''

    while (true){
        code = ''
        let hasLetter = false
        let hasNumber = false

        for(let i = 0;i<8;i++){
            const char = chars.charAt(Math.floor(Math.random() * chars.length ))
            code += char
            if(/[A-Z]/.test(char)) hasLetter = true
            if(/[2-9]/.test(char)) hasNumber = true
        }

        if(hasLetter && hasNumber && /(.)\1{2}/.test(code)){
            break;
        }
    }

    return `${code.substring(0,4)}-${code.substring(4)}`
}

export async function createSchoolCode(idSchool){

    const code = generateSchoolCode()
    const transaction = await db.sequelize.transaction()
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 5)
    try{
        const new_code = await schoolCode.create({code:code,idSchool:idSchool, expiresAt:expiresAt},transaction)
        if(new_code.code != code || new_code.idSchool != idSchool) throw new Error('Alguma coisa correu mal')
        await transaction.commit()
    }catch(error){
        await transaction.rollback()
        console.log(error.message)
    }

    return code

}