const router = require('express').Router();
const patientController = require('../controllers/patient.controller');

//const multer = require("multer");
//const upload = multer();

router.get('/', patientController.readPatient);
router.post('/', patientController.createPatient);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);
router.patch('/like-patient/:id', patientController.likePatient);
router.patch('/unlike-patient/:id', patientController.unlikePatient);

// comments
//router.patch('/comment-patient/:id', patientController.commentPatient);
//router.patch('/edit-comment-patient/:id', patientController.editCommentPatient);
//router.patch('/delete-comment-patient/:id', patientController.deleteCommentPatient);

module.exports = router;