import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import  User  from "../models/user.model.js";
import jwt from 'jsonwebtoken';


export const VerifyJwt = asynchandler( async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken // || req.header("Authorization")?.replace("Bearer ", "");
        console.log(token, "token in middleware");
        if(!token){
            res.status(401).json(
                new ApiResponse((401, {}, "token not available"))
            )      
        }
        
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded, "decoded");
        
        const user = await User.findById(decoded?.id).select("-password -refreshtoken");
        
        if(!user){
            throw new ApiError(401, "Not Authorized");
        }
    
        req.user = user;
        next();
    } catch (error) {
        console.log("JWT verification failed:", error?.message);
        new ApiResponse(401, {}, "err Not Authorized mag in err middleware");
    }
})