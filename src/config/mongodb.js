require('dotenv').config()
module.exports = {

    'database': 'mongodb://' + process.env.DB_HOST + '/' + process.env.DB_NAME,
    'secret': process.env.SRV_SECRET

};
