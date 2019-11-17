require('./config/config');

const express = require('express');


const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({origin:true,credentials: true}));




app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        const valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(442).send(valErrors);
    }
});

app.listen(process.env.PORT, () => {
    console.log('Démarrage du serveur sur le port :' + process.env.PORT);
});