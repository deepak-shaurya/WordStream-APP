import express from 'express';
import { VerifyJwt } from '../middlewares/Auth.middleware.js';

import { 
    commentArticle, 
    createArticle, 
    deleteArticle, 
    getallArticles, 
    getArticle, 
    getuserArticles, 
    likeunlikeArticle } from '../controllers/article.controller.js';
    
const router = express.Router();


router.post("/like/:id", VerifyJwt, likeunlikeArticle);
router.get("/all", getallArticles);
router.get("/user/:username", VerifyJwt, getuserArticles);
router.get("/get/:id", VerifyJwt, getArticle);

router.post("/create", VerifyJwt, createArticle);
router.post("/comment/:id", VerifyJwt, commentArticle);
router.delete("/:id", VerifyJwt, deleteArticle);

// router.get("/following", VerifyJwt, getfollowingArticle);
//router.get("/liked/:id", VerifyJwt, createArticle);

export default router