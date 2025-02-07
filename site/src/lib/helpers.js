export function getDayOfWeek(day, short){
    let daysOfWeek = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    let daysShort = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    if(short) return daysShort[day];

    return daysOfWeek[day];
}