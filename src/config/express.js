import compression from 'compression'
import helmet from 'helmet'
import morgan from 'morgan'
import config from '../config/mongodb'
import mongoose from 'mongoose'
import fileUpload from 'express-fileupload'
import passport from 'passport'


function App(app) {
    
    app.use(compression({
        threshold: 512
      }));
      //app.use(helmet());
      //app.disable('x-powered-by');
      app.use(morgan('dev'));
      app.use(passport.initialize());
      mongoose.connect(config.database); // connect to database
        app.set('superSecret', config.secret); // secret variable
        app.use(fileUpload());

}

module.exports = App;