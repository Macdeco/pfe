const jwt = require('jsonwebtoken');
const DoctorModel = require('../models/doctor.model');
const { signUpErrors, signInErrors } = require('../utils/errors.utils');

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
      expiresIn: maxAge
    })
  };
  


module.exports.signUp = async (req, res) => {
     const { pseudo, email, password } = req.body

    try {
        const doctor = await DoctorModel.create({ pseudo, email, password });
        res.status(201).json({ doctor: doctor._id });
    }
    catch (err) {
        const errors = signUpErrors(err);
        res.status(200).send({errors})
    }

}


module.exports.signIn = async (req, res) =>{
    const { email, password } = req.body

    try { 
        const doctor = await DoctorModel.login(email, password);
        const token = createToken(doctor._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge});
        res.status(200).json({doctor:doctor._id})
    } catch(err){
       const errors = signInErrors(err);
       res.status(200).json(err);
    }
}


module.exports.logout=(req , res) => {
    res.cookie('jwt', '' ,{maxAge: 1 });
    res.redirect('/');

}

