const jwt = require('jsonwebtoken');

module.exports.verifyJwtToken = (req, res, next) => {
    if (!req.cookies.token) {
        res.status(403).send({ auth: false, message: 'pas de token reçu' });
    }
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) res.status(500).send({ auth: false, message: 'Token non valide' });
        req._id = decoded._id;
        next();

    });
};
