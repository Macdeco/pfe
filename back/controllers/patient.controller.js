const PatientModel = require('../models/patient.model');
const DoctorModel = require('../models/doctor.model');

const ObjectId = require('mongoose').Types.ObjectId;

module.exports.readPatient = (req, res)=>{
    PatientModel.find((err, docs) => {
        if(!err) res.send(docs);
        else console.log('Error to get data :' +err);
    })

}

module.exports.createPatient = async (req, res) =>{
    const newPatient = new PatientModel ({
        patientId: req.body.patientId,
        message: req.body.message,
        video: req.body.video,
        likers:[],
        comments:[],
    });

    try {
        const patient = await newPatient.save();
        return res.status(201).json(patient);

    }catch (err){
        return res.status(400).send(err);
    }

};

module.exports.updatePatient = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
    const updatedRecord = {
      message: req.body.message,
    };
  
    PatientModel.findByIdAndUpdate(
      req.params.id,
      { $set: updatedRecord },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else console.log("Update error : " + err);
      }
    );
  };
  
  module.exports.deletePatient = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
    PatientModel.findByIdAndRemove(req.params.id, (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Delete error : " + err);
    });
  };
  
  module.exports.likePatient = async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).send("Id unknown : " + req.params.id);
  
    try {
      await PatientModel.findByIdAndUpdate (
        req.params.id,
        {
          $addToSet: { likers: req.body.id },
        },
        { new: true },
        (err, docs) => {
          if (err) return res.status(400).send(err);
        }
      );
      await DoctorModel.findByIdAndUpdate(
        req.body.id,
        {
          $addToSet: { likes: req.params.id },
        },
        { new: true },
        (err, docs) => {
          if (!err) res.send(docs);
          else return res.status(400).send(err);
        }
      );
    } catch (err) {
      return res.status(400).send(err);
    }
  };

  module.exports.unlikePatient = async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      await PatientModel.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { likers: req.body.id },
        },
        { new: true },
        (err, docs) => {
          if (err) return res.status(400).send(err);
        }
      );
      await DoctorModel.findByIdAndUpdate(
        req.body.id,
        {
          $pull: { likes: req.params.id },
        },
        { new: true },
        (err, docs) => {
          if (!err) res.send(docs);
          else return res.status(400).send(err);
        }
      );
    } catch (err) {
      return res.status(400).send(err);
    }
  };