require('dotenv').config()

import express from 'express'
import App from './config/express'
import serve from 'express-static'
import config from './config/mongodb'
import error from './libs/error'
import auth, {token} from './controllers/auth'
import upload from './controllers/upload'
import stats from './controllers/status'

const log = require('./libs/log')(module);
const port = process.env.PORT || 8001;


var app = express();
new App(app)

//app.post('/api/login', )

app.post('/api/signup', auth.setupPost)
app.post('/api/signup/user', auth.token, auth.setupUserPost)

app.post('/api/upload', upload.postUpload) //Uploads phone base
app.get('/api/upload', upload.getUpload) //Shows which phone base collections do we have
app.post('/api/numbers', upload.getPhone) //Shows specific phone number from given collection
app.post('/api/statistics', stats.postStatus) //POST statistics from user



app.get('/message',  function(req, res) {
     res.send('ok')
  });

app.use(error)

app.listen(port, () => log.info('Calling Bonobo Now Running On :' + port));