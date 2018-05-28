require('dotenv').config()

import bodyParser from 'body-parser'
import express from 'express'
import App from './config/express'
import serve from 'express-static'
import config from './config/mongodb'
import auth, {token, tokenUser} from './controllers/auth'
import upload from './controllers/upload'
import stats from './controllers/status'


const log = require('./libs/log')(module);
const port = process.env.PORT || 8001;


var app = express();
new App(app)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json()) // parse application/json

app.post('/api/signup', auth.setupPost); //
app.post('/api/signup/user', auth.token, auth.setupUserPost); //


app.post('/api/upload', auth.token, upload.postUpload); //Uploads phone base //
app.post('/api/login', auth.loginUser); //
app.get('/api/upload', auth.token, upload.getUpload); //Shows which phone base collections do we have //
app.post('/api/numbers', auth.tokenUser, upload.getPhone); //Shows specific phone number from given collection 
app.post('/api/statistics', auth.tokenUser, stats.postStatus); //POST statistics from user

app.get('/api/appointments', stats.getSales) //
app.get('/api/conversion', stats.getConversion) //
app.post('/api/conversion', stats.orders) //



app.listen(port, () => log.info('Calling Bonobo Now Running On :' + port));

//TODO
//Add conversion