const mongoose = require('mongoose');

function connect(){
    mongoose.set("strictQuery", false);
    mongoose.connect('mongodb://localhost/deep-fake-detector',()=>{
        console.log("Connected with the Database");
    });
}

module.exports = connect;