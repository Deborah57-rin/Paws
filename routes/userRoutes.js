const express = require ('express')
const bcrypt= require ('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router();
const user = require('../models/User');

const salt=10;
const JWT_SECRET = process.env.JWT_SECRET


router.post('/signup', async (req, res) => {

    const hashedPassword = await bcrypt.hash(req.body.password,salt)
    const registerDetails= await user.create({
        name:req.body.names,
        email:req.body.email,
        password:hashedPassword
    });
    res.json({success: true})
})

router.post('/login', async (req, res) => {

    const {mail, pass} = req.body;
    const person= await user.findOne({email:mail});

    if (!person){
        return res.json({sucess:false, message: "Email not found" })
    }
    //compare passwords by encrypting the entered passowrd to the 
    const validPassword= await bcrypt.compare(pass,person.password)

    if(!validPassword){
        return res.json({sucess:false, message: "Incorrect password"})
    }

    const token= jwt.sign(
        {   
            id:person._id,
            email:person.email
        },
        JWT_SECRET,
        {expiresIn: "1h"}
    )
    res.json({
        success: true,
        token
    })
})

module.exports= router;