const { clientDB } = require('../config/clientConfig.js')

const checkName = async (name) => {
    const user = await clientDB('krya_users').where({ username : name }).first();
    return user !== undefined && user !== null
}

const register = async (username, password) => {
    const userExists = await checkName(username);
    if (userExists) return { status : 'fail', message : 'user already exists'}
    let [newClient] = await clientDB('krya_users').insert({username, password}).returning('*');
    delete newClient.password
    return { status: 'ok', client: newClient}
}

module.exports = { checkName, register }