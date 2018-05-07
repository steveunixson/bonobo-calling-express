import bodyParser from 'body-parser'
import compression from 'compression'
import helmet from 'helmet'
import morgan from 'morgan'
import config from '../config/mongodb'
import mongoose from 'mongoose'
import error from '../libs/error'
import fileUpload from 'express-fileupload'
import passport from 'passport'


function App(app) {
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json()) // parse application/json
    app.use(compression({
        threshold: 512
      }));
      //app.use(helmet());
      //app.disable('x-powered-by');
      app.use(morgan('dev'));
      app.use(passport.initialize());
      mongoose.connect(config.database); // connect to database
        app.set('superSecret', config.secret); // secret variable
        //app.use(error)
        app.use(fileUpload());

}

module.exports = App;