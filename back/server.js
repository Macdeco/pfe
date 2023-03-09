const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const doctorRoutes = require('./routes/doctor.routes');
const patientRoutes  = require('./routes/patient.routes');
require('dotenv').config({path: './config/.env'});
require('./config/db');
const {checkDoctor , requireAuth}= require('./middleware/auth.middleware');
const app = express();



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());



//jwt
app.get('*', checkDoctor);
app.get('/jwtid', requireAuth, (req,res) => {
  res.status(200).send(res.locals.doctor._id)
});

//routes
app.use('/api/doctor' , doctorRoutes);
app.use('/api/patient', patientRoutes);


//server
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  })

  
