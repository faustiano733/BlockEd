import conta from "../db/models/contas.js";
import usuario from "../db/models/usuarios.js";
import escolas from "../db/models/escolas.js";
import localizacao from "../db/models/localizacao.js";



async function criarConta(nova_conta){
    const conta_criada = await conta.create(nova_conta);
    return conta_criada;
}

async function criarUsuario(novo_usuario){
    const usuario_criado = await  usuario.create(novo_usuario);
    return usuario_criado;
}

async function criarLocalizacao(nova_localizacao){
    const localizao_criada = await localizacao.create(nova_localizacao)
}

async function criarEscola(nova_escola){
    const escola_criada = await escolas.create(nova_escola);
    return escola_criada;
}

export async function cadastrar(conta, usuario, escola,localizacao){
    const nova_conta = criarConta(conta)
    const novo_usuario = criarUsuario({...usuario,conta_id:nova_conta.id})
    const localizacao_escola = criarLocalizacao(localizacao)
    const nova_escola = criarEscola({escola, localizacao_id:localizacao_escola.id})
}