const express = require('express')
const DB = require('./config/connection')
const app =  express();
require('dotenv').config();
const PORT = process.env.PORT || 4001 ;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// user route
const userRoute = require('./routes/userRoute');
app.use('/api/user',userRoute);

app.listen(PORT,()=>{
    console.log(`server is started on ${PORT}`)
})