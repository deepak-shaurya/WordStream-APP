import express from 'express';
import { 
    register,
    login,
    logout, 
    checkauth, 
    getuser, 
    followunfollowuser, 
    updateuser} from '../controllers/user.controller.js';
import { VerifyJwt } from '../middlewares/Auth.middleware.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);

// safe routes


router.route('/logout').post(VerifyJwt, logout);
router.route('/checkauth').get(VerifyJwt, checkauth );

router.route('/:username').get(VerifyJwt, getuser);
router.route('/follow/:id').get(VerifyJwt, followunfollowuser);
router.route('/update').post(VerifyJwt, updateuser);



export default router;
