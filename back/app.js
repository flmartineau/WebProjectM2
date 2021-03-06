require('./config/config');
require('./config/database');
require('./config/passport.config');

const express = require('express');


const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwtVerify = require('./config/jwt.verify') ;
const cors = require('cors');
const app = express();
const passport = require('passport');
const port = process.env.PORT || 3002;
const userRouter = require('./routers/user.router');
const projectRouter = require('./routers/project.router');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({origin:true,credentials: true}));
app.use(passport.initialize());

app.use('/api', userRouter);
app.use('/api/project', jwtVerify.verifyJwtToken, projectRouter);

app.use(express.static(path.join(__dirname, 'public')));
app.get('/*', (req, res) => res.sendFile(path.join(__dirname, 'public','index.html')));

app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        const valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(442).send(valErrors);
    }
});

app.listen(port, () => {
    console.log('Démarrage du serveur sur le port :' + port);
});

module.exports = app;
