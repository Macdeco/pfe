const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const doctorController = require('../controllers/doctor.controller');

//auth
router.post("/register", authController.signUp);
router.post('/login' , authController.signIn);
router.get('/logout', authController.logout);

// user display: 'block',
router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.doctorInfo)
router.put("/:id", doctorController.upadateDoctor);
router.delete('/:id', doctorController.deleteDoctor);
router.patch('/follow/:id', doctorController.follow);
router.patch('/unfollow/:id', doctorController.unfollow);


module.exports = router;