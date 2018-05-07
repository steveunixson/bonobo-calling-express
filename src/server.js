require('dotenv').config()

import express from 'express'
import App from './config/express'
import serve from 'express-static'
import config from './config/mongodb'

const log = require('./libs/log')(module);
const port = process.env.PORT || 8001;


// Create an express server and a GraphQL endpoint
var app = express();
new App(app)

app.listen(port, () => log.info('Calling Bonobo Now Running On :' + port));