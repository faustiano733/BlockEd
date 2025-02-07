import "dotenv/config"
import { cookies } from "next/headers.js"
import { encrypt } from "./auth.js"


export async function createSession(user_id){
    const expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const cookieStore = await cookies()

    const encrypeted_session = await encrypt({user_id, expireAt}) 
    cookieStore.set('session',encrypeted_session,{
        httpOnly:false,
        secure:false
    })

}

export async function getAuthenticatedUser(){
    const cookieStore = await cookies()
    const session = cookieStore.get("session")
}



