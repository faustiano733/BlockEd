import { NextResponse } from "next/server";
import { exceptionSchema } from "../validators/authValidator";
import { attempt } from "../db/models";


export async function createAttempt(new_attempt){
	let correct_date = new Date(new_attempt.createdAt);
	new_attempt = {...new_attempt, createdAt: correct_date};

    return await attempt.create(new_attempt);
}

export async function getExceptionsService(idSchool){
    return await exception.findAll({where:{idSchool:idSchool}})
}

export async function deleteExceptionService(id,idSchool){
    return await exception.destroy({where:{
        id:id,
        idSchool:idSchool
    }})
}


export async function getNumberOfAttempts(value, idSchool){
	const total = await attempt.count({
		where: {
			value: value,
			idSchool
		}
	});

	return total;
}

export async function getNumberOfAttemptsDate(date, idSchool){
	const total = await attempt.count({
		where: {
			createdAt: date,
			idSchool
		}
	});

	return total;
}

export async function getAllAttempts(idSchool){
	const tmps =  await attempt.findAll({
		where: {
			idSchool
		}
	})

	/*let now = new Date();
	now.setDate(now.getDate() - 1);
	let d = now.getDate() < 10 ? "0"+now.getDate() : now.getDate();
	let m = now.getMonth() + 1 < 10 ? "0"+(now.getMonth() + 1) : now.getMonth();
	let y = now.getFullYear();

	let now2 = y+"-"+m+"-"+d;
	tmps.map((ele, index)=>{
		tmps[index] = {...ele, condition: ele.createdAt == now2 }
	})*/

	return tmps;
}