const jwt = require("jsonwebtoken");
const DoctorModel = require("../models/doctor.model");

module.exports.checkDoctor = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.doctor = null;
        //res.cookie('jwt', '', { maxAge: 1 });
        next();
      } else {
        //console.log('decoded token' + decodedToken);
        let doctor = await DoctorModel.findById(decodedToken.id);
        res.locals.doctor = doctor;
        //console.log(res.locals.doctor);
        next();
      }
    });
  } else {
    res.locals.doctor = null;
    next();
  }
};

module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.send(200).json('no token')
      } else {
        console.log(decodedToken.id);
        next();
      }
    });
  } else {
    console.log('No token');
  }
};
