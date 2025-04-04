import { jwtVerify } from "jose";
const secretKey =  new TextEncoder().encode(process.env.SECRET_KEY);
export const verifyToken = async (token) => {
    try {
      if (!token) {
        return false;
      }
  
      const { payload } = await jwtVerify(token, secretKey);
      
      if (!payload.userId || !payload.schoolId) {
        return false;
      }
  
      // Retorna o payload para uso no middleware
      return payload;
      
    } catch (error) {
      console.log('Token verification error:', error);
      throw new TokenVerificationError();
    }
  };
  
  class TokenVerificationError extends Error {
    constructor() {
      super('Token inválido ou expirado');
      this.name = 'TokenVerificationError';
    }
  }