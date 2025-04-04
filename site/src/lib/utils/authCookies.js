
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 dias
  };
  
  /**
   * Configura os cookies de autenticação na resposta
   * @param {Response} response - Resposta HTTP
   * @param {string} token - Token JWT
   * @returns {Response} Resposta com cookies
   */
  export const setAuthCookies = (response, token) => {
    response.cookies.set('token', token, COOKIE_OPTIONS);
    return response;
  };
  
  /**
   * Remove os cookies de autenticação
   * @param {Response} response - Resposta HTTP
   * @returns {Response} Resposta sem cookies
   */
  export const clearAuthCookies = (response) => {
    response.cookies.delete('token');
    return response;
  };