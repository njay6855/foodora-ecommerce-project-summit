const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { cognito } = require('../config/config');
const { error } = require('../utils/logger');

const client = jwksClient({
  jwksUri: `https://cognito-idp.${cognito.region}.amazonaws.com/${cognito.userPoolId}/.well-known/jwks.json`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback(err);
    } else {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    }
  });
}

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  jwt.verify(token, getKey, {
    issuer: `https://cognito-idp.${cognito.region}.amazonaws.com/${cognito.userPoolId}`,
    audience: cognito.appClientId,
    algorithms: ['RS256']
  }, (err, decoded) => {
    if (err) {
      error('JWT verification error:', err);
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
