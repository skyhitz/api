const bcrypt = require('bcrypt');

export async function generateHash(password: string) {
  return bcrypt.hash(password, bcrypt.genSaltSync(12));
}

export async function validPassword(password: string, dbPassword: string) {
  return bcrypt.compare(password, dbPassword);
}
