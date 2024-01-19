const reqLogger = (req, res, next) => {
    console.log('req ->',req);
    next()
}

module.exports = { reqLogger }