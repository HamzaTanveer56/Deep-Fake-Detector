const mongoose = require('mongoose');

const deepfakeSchema = new mongoose.Schema({
    url: {
        type:String,
        required:true
    },
    accuracy: {
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:()=>Date.now()
    }
});

module.exports =  mongoose.model("DeepFake", deepfakeSchema);