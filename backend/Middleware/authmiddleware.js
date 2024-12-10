const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {

  const token = req.body.token || req.query.token || req.headers["authorization"];
  console.log(token);
  if (!token) {
    return res.status(401).send('Access Denied. No token provided.');
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
};

module.exports = auth;
