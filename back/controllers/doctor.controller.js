const DoctorModel = require('../models/doctor.model');
const ObjectId = require('mongoose').Types.ObjectId;


module.exports.getAllDoctors = async (req, res) => {
  const doctors = await DoctorModel.find().select('-password');
  res.status(200).json(doctors);
};

module.exports.doctorInfo = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send('ID unkown :' + req.params.id)

  DoctorModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log('ID unkown : ' + err);
  }).select('-password')
};

module.exports.upadateDoctor = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send('ID unkown :' + req.params.id)

  try {
    await DoctorModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio
        }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        if (err) return res.status(500).send({ message: err });
      }
    )
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.deleteDoctor = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send('ID unkown :' + req.params.id)

  try {
    await DoctorModel.remove({ _id: req.params.id }).exec();
    res.status(200).json({ message: "successfully deleted." });


  } catch (err) {
    return res.status(500).json({ message: err });

  }
}

module.exports.follow = async (req, res) => {
  if (
    !ObjectId.isValid(req.params.id) || 
    !ObjectId.isValid(req.body.idToFollow)
  )
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    // add to the follower list
    await DoctorModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true },
      (err, docs) => {
        
      }
    );
    // add to following list
    await DoctorModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } },
      { new: true, upsert: true },
      (err, docs) => {
        // if (!err) res.status(201).json(docs);
        if (err) return res.status(400).jsos(err);
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.unfollow = async (req, res) => {
  if (
    !ObjectId.isValid(req.params.id) ||
    !ObjectId.isValid(req.body.idToUnfollow)
  )
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await DoctorModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true, upsert: true },
      (err, docs) => {
        
      }
    );
    // remove to following list
    await DoctorModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      { $pull: { followers: req.params.id } },
      { new: true, upsert: true },
      (err, docs) => {
        // if (!err) res.status(201).json(docs);
        //if (err) return res.status(400).jsos(err);
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};


