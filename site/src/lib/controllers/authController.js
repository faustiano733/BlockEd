import { NextResponse } from 'next/server.js';
import { loginService, signup } from '../services/authServices.js';
import { setAuthCookies, clearAuthCookies } from '../utils/authCookies.js';
import { verifyToken } from '../utils/tokenService.js';

export const signController = async (req)=>{
  const {accountData,userData,schoolData,locationData} = await req.json()   
  let response = ''
  try{
    const isValid = await signup(accountData,userData,schoolData,locationData);
    if(isValid.status === 'ok'){
      //const url = new URL(req.url)
      //url.pathname = '/login'

      return NextResponse.json({message: "Cadastrado com sucesso"});
    }
  }catch(error){
    console.log(error.message)
    if(error.name === 'TypeError'){
      return NextResponse.json({error:error.message},{status:401})
    }
    if(error.message === 'Account Already Exists For this Email'){
      return NextResponse.json({error:error.message},{status:409})
    
    }
    return NextResponse.json({error:'Alguma coisa não está funcionando como devia'},{status:500})
  }
}


/**
 * Controlador para o processo de login
 * @param {Promise<Request>} req - requisicao HTTP
 * @returns {Promise<Response>} Resposta HTTP
 */
export const loginController = async (req) => {

  const {email, password} = await req.json() 
  console.log('passou')
  try {
    // Validação básica dos campos
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Autenticação do usuário
    const { token, user, school } = await loginService(email, password);

    // Cria a resposta de sucesso
    const url = new URL(req.url)
    url.pathname = '/'
  //console.log(user)
    const response = NextResponse.json(
      { 
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        school: {
          id: school.id,
          name: school.name
        }
      }
    );

    // Configura os cookies de autenticação
    return setAuthCookies(response, token);

  } catch (error) {
    console.error('Login error:', error);
    
    // Tratamento de erros específicos
    if (error.name === 'InvalidCredentialsError') {
      return Response.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Erro genérico
    return Response.json(
      { error: 'Ocorreu um erro durante o login' },
      { status: 400 }
    );
  }
};

/**
 * Controlador para logout
 * @returns {Response} Resposta HTTP
 */
export const logoutController = async () => {
  const response = NextResponse.json(
    { success: true, message: 'Logout realizado com sucesso' },
    { status: 200 }
  );
  return clearAuthCookies(response);
};

/**
 * Controlador para verificar sessão
 * @param {Request} request - Requisição HTTP
 * @returns {Promise<Response>} Resposta HTTP
 */
export const verifySessionController = async (request) => {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return Response.json(
        { isAuthenticated: false },
        { status: 200 }
      );
    }

    const payload = await verifyToken(token);
    
    return Response.json(
      { 
        isAuthenticated: true,
        user: {
          id: payload.userId,
          role: payload.role
        },
        school: {
          id: payload.schoolId
        }
      },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { isAuthenticated: false },
      { status: 200 }
    );
  }
};