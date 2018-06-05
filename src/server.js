require('dotenv').config()

import bodyParser from 'body-parser'
import express from 'express'
import App from './config/express'
import serve from 'express-static'
import config from './config/mongodb'
import auth, {token, tokenUser} from './controllers/auth'
import upload from './controllers/upload'
import stats from './controllers/status'
import { stat } from 'fs';


const log = require('./libs/log')(module);
const port = process.env.PORT || 8001;


var app = express();
new App(app)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json()) // parse application/json

app.post('/api/signup', auth.setupPost); //создает админа
app.post('/api/signup/user', auth.token, auth.setupUserPost); //создает пользователя
app.delete('/api/signup/user', auth.userRemove) //удаляет пользователя

app.post('/api/upload', auth.token, upload.postUpload); //Uploads phone base
app.post('/api/login', auth.loginUser); //логин
app.get('/api/upload', auth.token, upload.getUpload); //Shows which phone base collections do we have //
app.put('/api/upload', upload.activity) //меняет активность базы
app.post('/api/numbers', auth.tokenUser, upload.getPhone); //Shows specific phone number from given collection 

app.post('/api/statistics', auth.tokenUser, stats.postStatus); //POST statistics from user
app.delete('/api/statistics', stats.deleteStatus) //удаляет коментарий и статус


app.get('/api/appointments', stats.getSales) //показывает сколько записей всего
app.get('/api/conversion', stats.getConversion) //показывает конверсию за все время
app.post('/api/conversion', stats.orders) //данные о приходах
app.get('/api/conversion/month', stats.monthConversion)// конверсия по месяцам
app.get('/api/conversion/base', stats.getBaseConversion)// конверсия базы
app.get('/api/base', stats.showStatus) //счетчик записей перезвонов н.о недозвонов
app.get('/api/statuses', stats.moreStatus) //все статусы по клиентам

app.post('/api/salary', stats.salary) //задает начальные условия подсчета ЗП
app.delete('/api/salary', stats.salaryRemove) //удаляет начальные условия
app.get('/api/salary', stats.salaryShow) //показывает начальные условия

app.post('/api/salary/user', stats.getSalary) //считает ЗП

app.get('/api/template', upload.getTemplate) //отдает шаблон для базы клиентов




app.listen(port, () => log.info('Calling Bonobo Now Running On :' + port));

//TODO
//Add conversion