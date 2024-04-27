const mongoose = require('mongoose')

const connection =  async() => {
    try{
         await mongoose.connect('mongodb://127.0.0.1:27017/socialMedia');
        console.log('Database connection established')
    }   catch(e){
            console.log(e)
            throw new Error('error connecting to the database')
        }
}

module.exports = connection