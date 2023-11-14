const { clientDB } = require('../config/clientConfig.js')

const checkName = async (name) => {
    const user = await clientDB('krya_users').where({ username : name }).first();
    return user !== undefined && user !== null
}

module.exports = { checkName }