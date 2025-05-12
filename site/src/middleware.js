import { NextResponse } from "next/server";
import { verifyToken } from "./lib/utils/tokenService";

export async function middleware(request) {
  //console.log('teste de payload')
  if(!(request.cookies.has('token'))){        
    return redirectToLogin(request.nextUrl.clone())
  }

// Verificação de token
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return redirectToLogin(request.nextUrl.clone());
  }

  try {
    const payload = await verifyToken(token);
    
    // Clone da requisição para adicionar headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-school-id', payload.schoolId);
    requestHeaders.set('x-user-role', payload.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    console.error(`Authentication error for path :`, error);
    
    // Tratamento específico para diferentes tipos de erro

    return redirectToLogin(request.nextUrl, 'Erro de autenticação');
  }
}

// Função auxiliar para redirecionamento
function redirectToLogin(url, message = '') {
  const loginUrl = new URL('/login', url.origin);
  if (message) {
    loginUrl.searchParams.set('error', encodeURIComponent(message));
  }
  loginUrl.searchParams.set('redirect', url.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: [
      '/((?!login|_next/static|_next/image|favicon.ico|api/auth|cadastro|api/login|api/siggin|api/app).*)',
    ],
  };