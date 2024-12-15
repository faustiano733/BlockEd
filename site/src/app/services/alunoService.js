import { Op } from "sequelize";
import alunos from "../db/models/alunos.js";
import dispositivo from "../db/models/dispositivos.js";

export async function criarAluno(novo_aluno){
    const aluno_adicionado = await alunos.create({...novo_aluno});
    return aluno_adicionado;
}

export async function criarDispositivo(novo_dispositivo){
    const dispositivo_adicionado = await dispositivo.create(novo_dispositivo)
    return dispositivo_adicionado
}

export async function associarDispositivo(aluno,dispositivo){
    const dispositivo_associado = await criarDispositivo({...dispositivo,aluno_id:aluno.id})
    return dispositivo_associado
}

export async function pegarAlunos(){

    const lista_alunos = await alunos.findAll();
    return lista_alunos;
}

export async function pegarAluno(aluno_nome){
    const aluno = await alunos.findOne({
        where:{
            nome:aluno_nome
        }
    });
    return aluno;
}

export async function editarAluno(edicoes){
    const aluno_editado = alunos.update(edicoes,{
        where:{
            id:edicoes.id
        }
    });

    return aluno_editado;

}

export async function deletarAluno(aluno){
    await alunos.destroy({where:{
        [Op.and]:[{id:aluno.id},{nome:aluno.nome}]
    }})
}
