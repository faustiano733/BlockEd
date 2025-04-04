import { createExceptionController, deleteExceptionController, getAllExceptionsController } from "@/lib/controllers/exceptionController";

export async function POST(req){
    return await createExceptionController(req)
}

export async function GET(req){
    return await getAllExceptionsController(req)
}

export async function DELETE(req){
    return await deleteExceptionController(req)
}