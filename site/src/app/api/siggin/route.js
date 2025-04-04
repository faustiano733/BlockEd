import { signController } from "@/lib/controllers/authController.js";
export async function POST(req){
    return await signController(req);    
}