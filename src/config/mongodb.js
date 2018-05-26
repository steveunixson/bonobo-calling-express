require('dotenv').config()
module.exports = {

    'database': process.env.MONGODB_URI,
    'secret': process.env.SRV_SECRET

};

//mongodb://<dbuser>:<dbpassword>@ds135750.mlab.com:35750/heroku_gz99g234