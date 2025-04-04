import { logoutController } from "@/lib/controllers/authController"

export async function POST(){
    return logoutController()
}