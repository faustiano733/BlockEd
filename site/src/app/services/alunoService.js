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
    
    const lista_alunos_db = await alunos.findAll();
    let lista_alunos = []

    lista_alunos_db.forEach(async aluno=>{
        
        const informacoes_aluno = await pegaInformacoesAluno(aluno.nome)
        lista_alunos = [...lista_alunos, informacoes_aluno]
        
    })

    return await alunos.findAll()
}

async function pegarAluno(aluno_nome){
    const aluno = await alunos.findOne({
        where:{
            nome:aluno_nome
        }
    });
    if(aluno === null){
        return new TypeError("Aluno inexistente");
    }else{
        return aluno;
}}

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

export async function pegaTotalAlunos(){
    const total_alunos = await alunos.count()
    return total_alunos
}

async function pegaDispositivos(lista_id){
    const lista_dispositivos = await dispositivo.findAll({
        where:{
            aluno_id:lista_id
        }
    })
    return lista_dispositivos
}

export async function pegaInformacoesAluno(aluno_nome){
    
    const aluno = await pegarAluno(aluno_nome);

    const lista_dispositivos = await pegaDispositivos(aluno.id);

    const informacoes_aluno = {nome:aluno.nome, total:lista_dispositivos.length}

    return informacoes_aluno
}