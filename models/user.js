const mongoose = require('mongoose');

const user = new mongoose.Schema({
    userName:{
        type:String
    },
    email:{
        type:String,
    },
    password:{
        type:String
    },
    role:{
        type:String,
        enum:['admin','user','sales','manager'],
        
    },
    permission:{
        type:[String],
    },

}, {timestamps:true})

module.exports  = mongoose.model("user",user)