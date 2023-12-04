const { clientDB } = require('../config/clientConfig');

const checkName = async (name) => {
  const user = await clientDB('krya_users').where({ username: name }).first();
  return user !== undefined && user !== null;
};

const getUser = async (name) => clientDB('krya_users').where({ username: name }).first();

const register = async (username, password) => {
  const userExists = await checkName(username);
  if (userExists) return { status: 'fail', message: 'user already exists' };
  const [newClient] = await clientDB('krya_users').insert({ username, password }).returning('*');
  delete newClient.password;
  return { status: 'ok', client: newClient };
};

module.exports = { checkName, register, getUser };
