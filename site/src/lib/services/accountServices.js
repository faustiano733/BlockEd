import { account } from '../db/models.js';
import { accountSchema } from '../validators/authValidator.js';

export const createAccount = async (newAccount, transaction) => {
  const { error } = accountSchema.validate(newAccount);
  if (error) throw new TypeError(error);

  const existingAccount = await account.findOne({ where: { email: newAccount.email } });
  if (existingAccount) throw new Error('Account Already Exists For this Email');

  return await account.create(newAccount,transaction);
};

export const getAccount = async (email) => {
  return await account.findOne({ where: { email:email } });
};