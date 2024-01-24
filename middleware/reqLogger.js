const reqLogger = (req, res, next) => {
  // eslint-disable-next-line
  console.log('req ->', req);
  next();
};

module.exports = { reqLogger };
