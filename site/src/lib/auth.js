import 'dotenv/config'
import { SignJWT, jwtVerify } from "jose"

const key = process.env.SECRET_KEY
const encoded_key = new TextEncoder().encode(key)

export async function encrypt(payload){    
    const encrypetd = new SignJWT(payload)
    .setProtectedHeader({alg:'HS256'}).setIssuedAt()
    .setExpirationTime('7d').sign(encoded_key)
    
    return encrypetd
}

export async function decrypt(session){
    const { payload } = await jwtVerify(session, encoded_key,{
        algorithms:['HS256']
    }) 
}

