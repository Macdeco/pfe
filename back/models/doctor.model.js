const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');



const doctorSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 55,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6
    },
    picture: {
      type: String,
      default: "./uploads/profil/random-doctor.png"
    },
    bio :{
      type: String,
      max: 1024,
    },
    followers: {
      type: [String]
    },
    following: {
      type: [String]
    },
    likes: {
      type: [String]
    }
  },
  {
    timestamps: true,
  }
);

doctorSchema.pre("save", async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

doctorSchema.statics.login = async function(email, password) { 
  const doctor = await this.findOne({email});
  if (doctor) {
    const auth = await bcrypt.compare(password, doctor.password);
    if (auth) {
      return doctor;
    }
    throw Error ('incorrect password');
  }
  throw Error('incorrect email')
};



const DoctorModel = mongoose.model("doctor", doctorSchema);

module.exports = DoctorModel;

