const express = require("express");
const { register, login, logout, getOrganisation, getOrganisationInformation } = require('../controllers/UserController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/organisation', protect, getOrganisation);
router.get('/organisation/information', protect, getOrganisationInformation);


module.exports = router;