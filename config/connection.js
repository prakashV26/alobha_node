const mongoose = require('mongoose');
require('dotenv').config()
const conn = mongoose.connect(process.env.MONGO_URI)
.then(()=>{
   console.log('database connected')
})
.catch((err)=>{
    console.log("error to connect database ")
})

module.exports = conn ;