require('dotenv').config()

import bodyParser from 'body-parser'
import express from 'express'
import App from './config/express'
import config from './config/mongodb'
import auth, {token, tokenUser} from './controllers/auth'
import upload from './controllers/upload'
import stats from './controllers/status'
import org from './controllers/organization'


const log = require('./libs/log')(module);
const port = process.env.PORT || 8001;


var app = express();
new App(app)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json()) // parse application/json

app.post('/api/signup', org.key, auth.setupPost); //создает админа
app.post('/api/signup/user', org.key, auth.token, auth.setupUserPost); //создает пользователя
app.delete('/api/signup/user', org.key, auth.userRemove) //удаляет пользователя

app.post('/api/upload', org.key, auth.token, upload.postUpload); //Uploads phone base
app.post('/api/login', org.key, auth.loginUser); //логин
app.get('/api/upload', org.key, auth.token, upload.getUpload); //Shows which phone base collections do we have //
app.put('/api/upload', org.key, upload.activity) //меняет активность базы
app.post('/api/numbers', org.key, auth.tokenUser, upload.getPhone); //Shows specific phone number from given collection 

app.post('/api/statistics', org.key, auth.tokenUser, stats.postStatus); //POST statistics from user
app.delete('/api/statistics', org.key, stats.deleteStatus) //удаляет коментарий и статус

app.get('/api/statistics', org.key, stats.statusByOperator) //оператор сможет увидеть свои перезвоны и другие статусы по клиентам

app.get('/api/appointments', org.key, stats.getSales) //показывает сколько записей всего
app.get('/api/conversion', org.key, stats.getConversion) //показывает конверсию за все время
app.post('/api/conversion', org.key, stats.orders) //данные о приходах
app.get('/api/conversion/month', org.key, stats.monthConversion)// конверсия по месяцам
app.get('/api/conversion/base', org.key, stats.getBaseConversion)// конверсия базы
app.get('/api/base', org.key, stats.showStatus) //счетчик записей перезвонов н.о недозвонов за все время
app.get('/api/statuses', org.key, stats.moreStatus) //все статусы по клиентам

app.post('/api/salary', org.key, stats.salary) //задает начальные условия подсчета ЗП
app.delete('/api/salary', org.key, stats.salaryRemove) //удаляет начальные условия
app.get('/api/salary', org.key, stats.salaryShow) //показывает начальные условия

app.post('/api/salary/user', org.key, stats.getSalary) //считает ЗП

app.get('/api/template', org.key, upload.getTemplate) //отдает шаблон для базы клиентов

app.get('/api/org', org.showOrganization) //найти организацию
app.post('/api/org', org.createOraganization) //создать организацию
app.delete('/api/org', org.deleteOrganization) //удалить организацию

app.get('/', org.key, function(req, res){
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.send(fullUrl)
})


app.listen(port, () => log.info('Calling Bonobo Now Running On :' + port));

//TODO
//Add conversion
//http://www.innopolis.com/business/