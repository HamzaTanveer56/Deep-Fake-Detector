const express = require('express');
const app = express.Router();
const jwt = require('jsonwebtoken');
const validation = require('../public/js/validation');
const User = require('../models/user');
const bcrypt = require('bcrypt'); 
const nodemailer = require('nodemailer');
const multer = require('multer');
const axios = require('axios');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
require('dotenv').config();

//GET home page
app.get('/home',(req,res)=>{
    if(req.cookies.token){
        jwt.verify(req.cookies.token,process.env.JWT_SECRET,async(err,decoded) => {
            res.render('landingPage')
        });
    }else{
        res.render('login',{errorMsg: 'Sign In to access homepage'})
    }
})

//GET login page
app.get('/login',(req,res)=>{
    res.render('login');
})

//GET registration page
app.get('/register',(req,res)=>{
    res.render('register');
})

//GET checkout page
app.get('/checkout',(req,res)=>{
    res.render('checkout');
})

//GET checkout-success page
app.get('/checkout-success',(req,res)=>{
    res.render('checkout-success');
})

//GET checkout-failure page
app.get('/checkout-failure',(req,res)=>{
    res.render('checkout-failure');
})

//GET forgot password page
app.get('/forgot-password',(req,res)=>{
    res.render('forgot-password');
})

//GET reset password success page
app.get('/forgot-password-success', (req, res) => {
    res.render('forgot-password-success');
})

//GET reset password success page
app.get('/forgot-password-failed', (req, res) => {
    res.render('forgot-password-failed');
})

//GET reset password page
app.get('/reset-password/:token',(req,res)=>{
    jwt.verify(req.params.token,process.env.JWT_SECRET,(err,decoded) => {
        if(err){
            res.render('forgot-password-failed');
        }

        if(req.cookies.token){
            res.clearCookie('token');
        }

        res.cookie('token',req.params.token);

        res.render('reset-password',{email:decoded.email});
    });
})

//POST login requests
app.post('/login',async(req,res)=>{
    try{
        validation.emailValidator(req.body.email);
        let user = await User.findOne({email:req.body.email});
        if(user){
            if(await bcrypt.compare(req.body.pass,user.password))
            {
                const payload = {
                    email:user.email,
                    id:user._id
                };
                jwtToken = JSON.stringify(jwt.sign(payload,process.env.JWT_SECRET));
                if(req.cookies.token)
                    res.clearCookie('token');
                res.cookie('token',jwtToken);
                res.redirect('/home');
            }else{
                return res.render('login',{passErrorMsg:"The password you've entered is incorrect!"});
            }            
        }else
            return res.render('login',{emailErrorMsg:"The email you've entered is not registered!"});   
    }
    catch(e){
        return res.render('login',{errorMsg:'Internal Server Error'});
    }
})

//POST registration requests
app.post('/register',async (req,res)=>{
    try{
        let data = {
            fname:req.body.fname,
            lname:req.body.lname,
            pass:req.body.pass,
            cpass:req.body.cpass,
            email:req.body.email
        }

        validation.nameValidator(data['fname']);
        validation.nameValidator(data['lname']);
        validation.emailValidator(data['email']);
        validation.passValidator(data['pass']);
        validation.passValidator(data['cpass']);
        validation.passEqualityChecker(data['pass'],data['cpass'])

        let user = await User.findOne({email:data['email']});
        if(user)
            return res.render("register",{emailErrorMsg:"This email is already registered"});
        else{
            const salt = await bcrypt.genSalt(10);
            data['pass'] = await bcrypt.hash(data['pass'],salt);
            let myUser = new User({
                fname:data['fname'],
                lname:data['lname'],
                email:data['email'],
                password:data['pass']
            })
            await myUser.save();
            return res.render('register',{successMsg:"Successfully Registered"});
        }
    }
    catch(e){
        return res.render('register',{successMsg:"Internal Server Error"});
    }
})

//POST reset password requests
app.post('/reset-password/reset-password',(req,res)=>{
    jwt.verify(req.cookies.token,process.env.JWT_SECRET,async(err,decoded) => {
        if(err){
            res.redirect('/forgot-password-failed');
        }
        if(decoded.id){
            let user = await User.findOne({_id:decoded.id});
            if(user){
                try{
                    let pass = req.body.pass;
                    let cpass = req.body.cpass;
                    validation.passValidator(pass);
                    validation.passValidator(cpass);
                    validation.passEqualityChecker(pass,cpass);
                    const salt = await bcrypt.genSalt(10);
                    const newPass = await bcrypt.hash(pass,salt);
                    await User.updateOne({email:user.email},{$set:{password:newPass}},{new: true});
                    res.redirect('/forgot-password-success');
                }catch(e){
                    res.redirect('/forgot-password-failed');
                } 
            }else{
                res.redirect('/forgot-password-failed');
            }
        }
        else{
            res.redirect('/forgot-password-failed');
        }
    });
})

//POST forgot password requests
app.post('/forgot-password',async(req,res)=>{
    try{
        let email = req.body.email;
        validation.emailValidator(email);
        let user = await User.findOne({email:email});
        if(user){
            const payload = {
                email:user.email,
                id:user._id
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'15m'});
            const link = `localhost:3000/reset-password/${token}`;

            const transporter = nodemailer.createTransport({
                service:'hotmail',
                auth:{
                    user:process.env.EMAIL,
                    pass:process.env.PASSWORD
                }
            });

            const mailOptions = {
                from:process.env.EMAIL,
                to:user.email,
                subject:'Deep Fake Detector Account Recovery',
                text: `Copy and paste this URL in search tab to reset your password. Please don't share this with anyone \n ${link}`
            }

            transporter.sendMail(mailOptions,(err,data)=>{
                if(err){
                    return res.render('forgot-password',{errorMsg:'Unable to sent email to this account'});
                }
                return res.render('forgot-password',{confirmMsg:'Check Your Email for Reset Password Link!'});
            });
        }else
        {
            return res.render('forgot-password',{errorMsg:'Invalid Email, No such Account exist'});
        }
    }catch(e){
        return res.render('forgot-password',{errorMsg:'Internal Server Error'});
    }
})

//POST checkout request
app.post('/checkout',async(req,res)=>{
    try{
        const session = await stripe.checkout.sessions.create({
            line_items: [
              {
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: req.body.items[0].name,
                  },
                  unit_amount: req.body.items[0].amount,
                },
                quantity: 1,
              },
            ],
            mode: 'payment',
            success_url: `http://localhost:3000/checkout-success`,
            cancel_url: `http://localhost:3000/checkout-failure`,
        });
        res.json({ url: session.url })
        } catch (e) {
            res.json({ url: `http://localhost:3000/checkout-failure` })
        }
})

//POST contact form
app.post('/contact-form',async(req,res)=>{
    try{

        validation.nameValidator(req.body.name);
        validation.emailValidator(req.body.email);
        
        const transporter = nodemailer.createTransport({
            service:'hotmail',
            auth:{
                user:process.env.EMAIL,
                pass:process.env.PASSWORD
            }
        });
       
        const mailOptions = {
            from:process.env.EMAIL,
            to:process.env.EMAIL,
            subject:req.body.subject,
            text: `${req.body.message} \n From \n ${req.body.name} \n Email \n ${req.body.email}`
        }
    
        transporter.sendMail(mailOptions,(err,data)=>{
            if(err){
                res.render('landingPage',{declineMessage : "Failed to Send Email "}).send();
                console.log(err);
            }else{
                res.render('landingPage',{confirmMessage : "Email Sent"}).send();
                console.log('email sent');
            }
        });
    }catch(e){
        console.log(e.message)
    }
});

// create the multer upload object
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './downloads/');
        },
        filename: function (req, file, cb) {
            const videoName = `${Date.now()}-${file.originalname}`;
            req.videoName = videoName;
            cb(null,videoName);
        }
    })
});

//POST upload video
app.post('/upload_video', upload.single('video'), async (req, res) => {
    const result = await axios.get(`http://localhost:8080/process_video/${req.videoName}`);
    const accuracy = result.data.result.toFixed(2);
    console.log(accuracy);

    if (accuracy > 0.65) {
        return res.json({
            message: `This video is a Deep Fake. AI is ${accuracy*100}% sure.`,
        });
    } else {
        return res.json({
            message: `This video is a Real Video. AI is ${(1-accuracy)*100}% sure.`,
        });
    }
});

module.exports = app;