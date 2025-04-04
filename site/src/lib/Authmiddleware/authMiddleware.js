import 'dotenv/config';

const secretKey = TextEncoder().encode(process.env.SECRET_KEY)

export const authMiddleware = async (headers)=>{

    const authorization = headers.get('authorization')
    const token = authorization.split(' ')[1]
    if(!token){
        
    }


}