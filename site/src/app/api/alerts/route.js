import { NextResponse } from "next/server.js";
import {alert} from "@/lib/db/models";
import {students} from "@/lib/db/models";
import {device} from "@/lib/db/models";

export async function GET(req){
	const schoolId = req.headers.get('x-school-id')
	console.log(schoolId)
    const result = await alert.findAll({
    	where:{
    		idSchool: schoolId
    	}, 
    	order: [["createdAt", "DESC"]]
    });
    return NextResponse.json(result);
}


export async function POST(req){
	const dados = await req.json();
    const token = dados.token;
    //const attempts = dados.attempts;


    console.log("Attempts", attempts);

    const chave = new TextEncoder().encode("12345678901234567890123456789012");
    let result;
    try {
        const  {payload, protectedHeader} = await jwtDecrypt(token, chave)
        result = payload;
    } catch(error){
        return NextResponse.json({success: false, error: "Erro no token armazenado"});
    }

    try{
    	const getStudent = await students.findByPk(result.idStudent)
    	const getDevice = await device.findByPk(result.idDevice);

    	const created = await alert.create({
    		idSchool: result.idSchool,
    		text: `${getStudent.name} desinstalou o app do seu smartphone ${getDevice.model}`
    	})

    	return NextResponse.json({done: true})
	} catch(error) {
		return NextResponse.json({done: false}, {status: 500})
	}

}

