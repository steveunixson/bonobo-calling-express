require('dotenv').config()

import express from 'express'
import App from './config/express'
import serve from 'express-static'
import config from './config/mongodb'
import error from './libs/error'
import auth, {token} from './controllers/auth'

const log = require('./libs/log')(module);
const port = process.env.PORT || 8001;


var app = express();
new App(app)

//app.post('/api/login', )

app.post('/api/signup', auth.setupPost)
app.post('/api/signup/user', auth.token, auth.setupUserPost)



app.get('/message',  function(req, res) {
     res.send('ok')
  });

app.use(error)

app.listen(port, () => log.info('Calling Bonobo Now Running On :' + port));