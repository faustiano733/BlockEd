import { getProfileDataController, updateProfileController } from "@/lib/controllers/profileController"

export async function GET(req){
    const userId = req.headers.get('x-user-id')
    return await getProfileDataController(userId)    
}

export async function PUT(req){
    return await updateProfileController(req)   
}