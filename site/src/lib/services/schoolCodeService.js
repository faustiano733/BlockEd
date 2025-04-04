import { school } from "../db/models"

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

export async function createSchoolCode(SchoolId){
}

