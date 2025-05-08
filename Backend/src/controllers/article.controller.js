import Article from "../models/article.model.js";
import User from "../models/user.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import {v2 as cloudinary} from 'cloudinary';
import Notification from "../models/notification.model.js";
import Comment from "../models/comment.model.js";

export const createArticle = asynchandler( async (req , res)=>{
    const {Title, content}= req.body;
    const userid = req.user._id.toString();
    let {img} = req.body

    try {
        
        const user = await User.findById(userid);
        if(!user){
            res.status(401).json({err: "user not found"})
        }

        if(!Title && !content){
            res.status(401).json({err: "Title and content both are required..."})
        }

        if(img){
            const ArticleImage = await cloudinary.uploader.upload(img);
            img = ArticleImage.secure_url;
        }

        const newarticle = await Article.create({
            user : userid,
            Title,
            content,
            image : img
        })

        return res.status(200).json(newarticle);
        
    } catch (error) {
        console.log("errer in createArticle", error.message);
        res.status(500).json({err: "something went wrong in creating article.."});
    }
    
});

export const likeunlikeArticle = asynchandler( async (req , res)=>{
    try {
        const userid = req.user._id;
        const {id} = req.params;

        const article = await Article.findById(id);

        if(!article){
            return res.status(401).json({err: "article not found"})
        }

        const userliked = article.likes.includes(userid);

        if(userliked){
            await Article.updateOne({ _id: id }, { $pull: { likes: userid } });
            const updatedlikes = article.likes.filter((id)=> id.toString() !== userid.toString());
            return res.status(200).json(updatedlikes);
        }else{
            article.likes.push(userid);
            await article.save();

            const notification = await Notification.create({
				from: userid,
				to: article.user,
				type: "like",
			});

            const updatedlikes = article.likes;
			return res.status(200).json(updatedlikes);
        }

    } catch (error) {
        res.status(500).json({err: error.message})
    }
    
});

export const commentArticle = asynchandler( async (req, res)=>{
    try {
        const {id:articleid}= req.params;
        const {content} = req.body;
        const article = await Article.findById(articleid);
        if(!article){
            return res.status(401).json({message: "article not found..."});
        }

        if(!content){
            return res.status(401).json({message: "conntent needed to comment"});
        }

        const comment = await Comment.create({
            user: req.user._id,
            Content:content,
            article: article._id
        });

        if(comment){
            await Article.updateOne({_id: articleid}, {$push: {Comment:comment._id}});
            return res.status(200).json({message: "successfully commented on Article", comment});
        }
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
})

export const deleteArticle = asynchandler( async (req , res)=>{
    try {
        const {id} = req.params;
        const post = await Article.findById(id);
        console.log(post);
        
        if(!post){
            res.status(401).json({err: "article not found"});
        }
        console.log(post.user);
        
        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({err: "you are not authorized to delete the post"});
        }

        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
        }
        await Article.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });

    } catch (error) {
        console.log("Error in deletePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
    }
    
});

export const getallArticles = asynchandler( async (req , res)=>{
    try {
        const articles = await Article.find()
        .sort({createdAt: -1})
        .populate({
            path:"user",
            select: "-password -refreshToken"
        })

        if(articles.length === 0){
            return res.status(200).json([])
            
        }

        return res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
    
});

export const getArticle = asynchandler( async (req , res)=>{
    try {
        const {id} = req.params;
        const article = await Article.findById(id)
        .populate({
            path: "user",
            select: "-password -refreshtoken"
        })
        .populate({
            path:"Comment",
            populate :{
                path:"user",
                select: "-password -refreshtoken"
            }
        })
        

        if(!article) {
            return res.status(401).json({err: "article not found..."})
        }

        return res.status(200).json(article);
    } catch (error) {
        res.status(500).json({err: error.message})
    }
    
});

export const getuserArticles = asynchandler( async (req , res)=>{
    try {
        const {username} = req.params;
        console.log(username);
        
        if(!username){
            return res.status(401).json({message: "user not in paramas..."})
        }
        const user = await User.findOne({username});
        console.log(user);
        
        if(!user){
            return res.status(401).json({message: "user not found..."})
        }
        const article = await Article.find({user:user._id})
        .populate({
            path:"user",
            select:"-password -refreshtoken"
        });
        if(!article){
            return res.status(401).json({message: "article not found..."})
        }
        // if (article.length === 0) {
        //     res.status(200).json([]);
        // } 
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({err: error.message})
    }
    
});