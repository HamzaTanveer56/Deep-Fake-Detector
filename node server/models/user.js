const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true,
        minLength:2,
        maxLength:25
    },
    lname:{
        type:String,
        required:true,
        minLength:2,
        maxLength:25
    },
    email:{
        type:String,
        required:true,
        immutable:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        immutable:false
    },
    createdAt:{
        type:Date,
        default:()=>Date.now()
    }
});

module.exports =  mongoose.model("User",userSchema);