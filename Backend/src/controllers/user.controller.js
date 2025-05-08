import {asynchandler} from '../utils/asynchandler.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import {v2 as cloudinary} from 'cloudinary';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import Notification from '../models/notification.model.js';

const ganarateTokens = async (userid) => {
    try {
        const user = await User.findById(userid);
        if(!user){
            throw new ApiError(404, "User not found");
        }
        const accesstoken = await user.GerateAccessToken();
        const refreshtoken = await user.GerateRefreshToken();
        user.refreshtoken = refreshtoken;
        await user.save();
        return {accesstoken, refreshtoken};
    } catch (error) {
        throw new ApiError(500, error.message);
    }
};

const register = asynchandler( async (req, res) => {
    
    const {username , email, bio, password, fullname} = req.body;
    
    if( [username, email, password, fullname].some((feald) => feald?.trim() === "")){
        throw new ApiError(400, "all feald are required")
    }
    
    const userExist = await User.findOne({
        $or : [{username}, {email}]
    });

    if(userExist){
        res.json(409, "user all ready registered...")
    }
    
    
    const user = await User.create({
        fullname,
        password,
        email,
        bio,
        username: username.toLowerCase()
    })
    
    const createduser = await User.findById(user._id).select(
        "-password -refreshtoken"
    )
    const {accesstoken, refreshtoken} = await ganarateTokens(createduser._id);
   

    return res
    .status(200)
    .cookie("accessToken", accesstoken,  {
        httpOnly: true,
        secure: true,
    })
    .cookie("refreshToken", refreshtoken,  {
        httpOnly: true,
        secure: false,
        path: "/api/v1/user/refreshToken"
    })
    .json( new ApiResponse(201, createduser, "User created successfully"));  
    
});

const login = asynchandler( async (req, res) => {

    try {
      const {email, password} = req.body;
  
      console.log(email, password);    
      
  
        if( [email, password].some((feald) => feald?.trim() === "")){
        throw new ApiError(400, "all fealds are required")
        }
  
        const user = await User.findOne({email}).select("-refreshtoken");
  
        if(!user){
            throw new ApiError(404, "User not found");
        }
  
      
  
        const ismatch = await user.ispasswordcorrect(password);
        if(!ismatch){
            throw new ApiError(401, "password is incorrect");
        }
  
  
        const {accesstoken, refreshtoken} = await ganarateTokens(user._id);
  
        const userobject = user.toObject();
        delete userobject.password;
  
        return res
        .status(200)
        .cookie("accessToken", accesstoken,  {
            httpOnly: true,
            secure: true,
            })
        .cookie("refreshToken", refreshtoken,  {
            httpOnly: true,
            secure: false,
            path: "/api/v1/user/refreshToken"
        })
      .json(
        new ApiResponse(
            200, 
            userobject,
            "User logged In Successfully"
        ))
    } catch (error) {
        res.status(500).json({err: error.message});
    }
});

const logout = asynchandler( async (req, res) => {
    try {
        const abc ={
            id : req.user._id,
            mag: "logout controler executed..."
        }
        console.log(abc);
        
        await User.findByIdAndUpdate(req.user._id,
            {
                $set:{refreshtoken: undefined}
            }, 
            {new: true}
        );
        console.log("code executed...1");
        res.status(200)
        .clearCookie("accessToken" , {
            httpOnly: true,
            secure: true
        })
        .clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            path: "/api/v1/user/refreshToken"
        })
        .json(
            new ApiResponse(200,{}, "user logged out successfully")
        );
    
        console.log("code executed...2");
        
    } catch (error) {
        res.status(500).json({err: error.message});
    }
});

const checkauth = asynchandler( async ( req , res ) => {
    try {
        const user = req.user
        if(!user){
            new ApiResponse(401, {},"something went wrong...")
        }
    
        return(
            res.status(201).json(
                new ApiResponse(201, user, "user is logged in!")
            )
        )
    } catch (error) {
        res.status(500).json({err: console.log(error.message)})
    }
});

const getuser = asynchandler( async (req, res) =>{
    const { username} =  req.params;

    try {
        const user = await User.findOne({username}).select("-password -refreshtoken");
    
        if(!user){
            res.status(401).json({masg: "user not found!"})
        }
    
        return (
            res.status(200).json({user})
        )
    } catch (error) {
        res.status(500).json({errer: "something went wrong while getting user"})
    }
})

const followunfollowuser = asynchandler( async (req, res) =>{
    try {
        const {id} = req.params;
        const usertomodify = await User.findById(id);
        const currentuser = await User.findById(req.user._id);

        if(!usertomodify || !currentuser){
            return ( 
                res.status(401).json({message: "user not found.."})
            )
        }

        if(id === req.user._id.toString()){
            return res.status(300).json({message: "you can't follow yourself..."});
        }

        const isfollowing = currentuser.followings.includes(id);

        if(isfollowing){
            await User.findByIdAndUpdate(id, { $pull: {followers: req.user._id}});
            await User.findByIdAndUpdate(req.user._id, { $pull: {followings: id}});
            res.status(200).json({message: "user unfollowed successfully..."})
        }else{
            await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}});
            await User.findByIdAndUpdate(req.user._id, {$push: {followings: id}});
            const newNotification = await Notification.create({
				type: "follow",
				from: req.user._id,
				to: usertomodify._id,
			});
            res.status(200).json({ message: "User followed successfully" });
        }
        

    } catch (error) {
        console.log("errer in follow unfollow");
        res.status(500).json({message: error.message})
    }
})

const updateuser = asynchandler( async (req , res) =>{
    const {fullname , username , newpassword , oldpassword, bio, email } = req.body;
    let  {profilepic, coverImg} = req.body;
    const userid = req.user._id;

    try {
        
        let user = await User.findById(userid);
        if(!user){
            return res.status(401).json({err: "user not found in update"})
        }

        if((!newpassword && oldpassword )|| (!oldpassword && newpassword)){
            return res.status(401).json({err: "both password is needed to be filled"})
        }

        if(newpassword && oldpassword){
            const match = await user.ispasswordcorrect(oldpassword);
            if(!match){
                return res.status(401).json({err: "old password is incorrect."})
            }
            if(newpassword.length <= 8){
                return res.status(401).json({err: "password should be more then 8 "})
            }
            user.password = newpassword;

        }

        if(profilepic){
            if(user.profile){
                await cloudinary.uploader.destroy(user.profilepic.split("/").pop().split(".")[0]);
            }

            const uploadedResponse = await cloudinary.uploader.upload(profilepic);
            user.profilepic = uploadedResponse.secure_url;
        }
        if(coverImg){
            if(user.coverImg){
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            }

            const uploadedResponse = await cloudinary.uploader.upload(coverImg);
            user.coverImg = uploadedResponse.secure_url;
        }
        user.fullname = fullname || user.fullname;
		user.email = email || user.email;
		user.username = username || user.username;
		user.bio = bio || user.bio;
		user.profilepic = profilepic || user.profilepic;
        user.coverImg = coverImg || user.coverImg;
        user = await user.save();

        user.password = null;

        return res.status(200).json(user);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({err: error.message})
    }
})

export {
    register,
    login,
    logout,
    checkauth,
    getuser,
    followunfollowuser,
    updateuser,
    
};