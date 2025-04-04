import { loginController } from '../../../lib/controllers/authController.js';

export async function POST(request) {
  console.log('passou')
  return await loginController(request)
}