const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/dbConn');
const cors = require("cors"); 
const cookieParser = require('cookie-parser');
const app = express();
const userRouter = require('./routes/user');
const apiRouter = require('./routes/api');

//Establishing database connection
db();

//app listening at port-3000
app.listen(3000);

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({  
  extended: true
})); 
app.use(cookieParser());
app.use(cors()); 

//Rendering Web forms
app.set('view engine','ejs');

//Static content
app.use(express.static('public'));

//Setting user router
app.use('/',userRouter);

//Setting downlaod api router
app.use('/download',apiRouter);