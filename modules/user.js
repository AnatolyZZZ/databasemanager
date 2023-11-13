const { userDB } = require('../config/userConfig.js')

const checkName = async (name) => {
    const user = await userDB('krya_users').where({ username : name }).first();
    return user !== undefined && user !== null
}

module.exports = { checkName }