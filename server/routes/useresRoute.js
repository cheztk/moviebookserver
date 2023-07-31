const router = require('express').Router();
const User = require('../models/userModel');

const bcrypt =  require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', async(req,res) => {
    try{
        const userExists = await User.findOne({email: req.body.email});
        if(userExists){
            return res.send({
                success: false,
                message: "User already exists",
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        const newUser = new User(req.body);
        await newUser.save();
        res.send({
            success: true,
            message: "User creates successfully"
        });

    }catch(err){
        console.log(err.message);
        res.send({
            success: false,
            message: err.message
        })
    }
});

router.post('/login', async(req, res) => {

    try{
        const user = await User.findOne({email: req.body.email});
        if(!user){
            return res.send({
                success: false,
                message: "User not founds"
            })
        }
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if(!validPassword){
           return res.send({
                success: false,
                message: "Invalid password"
            })
        }
        const token = jwt.sign({_id: user._id}, process.env.jwt_secret, {
            expiresIn: "1d",
        })
        res.send({success: true, message: "User logged in successfully", data: token});
    }catch(err){
        res.send({
            success: false,
            message: err.message,
        });
    }
})

router.get('/get-current-user', authMiddleware, async(req,res) => {
    try{
       // console.log('userId', req.body.userId);
        const user = await User.findById(req.body.userId).select("-password");

        res.send({
            success: true,
            message: "User detail fetch successfully",
            data: user
        })
    }catch(err) {
        res.send({
            success: false,
            message: err.message
        })
    }
})

module.exports = router;