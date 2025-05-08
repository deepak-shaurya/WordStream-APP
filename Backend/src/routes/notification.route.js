import express from 'express';
import { VerifyJwt } from '../middlewares/Auth.middleware.js';
import { deleteNotifications, getNotifications } from '../controllers/notification.controller.js';

const router = express.Router();

router.get("/",VerifyJwt, getNotifications);

router.delete("/",VerifyJwt, deleteNotifications);

export default router