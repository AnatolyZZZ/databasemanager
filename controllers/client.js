const { checkName } = require("../modules/client.js");

const _chekName = async (req, res) => {
    try {
        const db_res = await checkName(req.body.username);
        res.status(200).json({exist : db_res})
    } catch (error) {
        console.log('error in user controller', error);
        res.status(500).json({msg : `error checking user ${(req.body.username)}`});
    }
}

module.exports = { _chekName }