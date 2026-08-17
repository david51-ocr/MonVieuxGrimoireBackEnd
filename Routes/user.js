const express = require ('express');
const userCtrl = require ('../Controllers/user');
const router = express.Router();

router.post ('signUp', userCtrl.signup);
router.post ('login', userCtrl.login);

module.exports=router;