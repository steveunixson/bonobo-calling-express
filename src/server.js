require('dotenv').config()

import express from 'express'
import App from './config/express'
import serve from 'express-static'
import config from './config/mongodb'
import login, { passportAll } from './controllers/passport'
import passport from 'passport'


const log = require('./libs/log')(module);
const port = process.env.PORT || 8001;


// Create an express server and a GraphQL endpoint
var app = express();
new App(app)

app.post('/api/login', login.getUsers)

app.post('/api/signin', login.postUsers)

app.all('*', passportAll)

//all routes from this point are now protected by passport

app.get('/message', passport.authenticate('bearer', { session: false }), function(req, res) {
     res.send('ok')
  });
  
app.use(function(err, req, res, next) {
    console.error(err);
    return res.status(403).json({ status: 'error', code: 'unauthorized' });
  });

app.listen(port, () => log.info('Calling Bonobo Now Running On :' + port));