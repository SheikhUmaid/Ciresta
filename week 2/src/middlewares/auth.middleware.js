import ApiError from "../utils/util.apiError.js"
import {ACCESSTOKENKEY} from "../constants.js"
import User from "../models/user.model.js"
import asyncHandler from "../utils/util.asyncHandler.js"
import jwt from "jsonwebtoken"
const verifyJWT = asyncHandler( async (req,_,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            throw new ApiError(201, "Failed to Authenticate");
        }
        const decodedToken = jwt.verify(token, ACCESSTOKENKEY);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if(!user){
            throw new ApiError(401, "Incorrect Access Token");
        }
        req.user = user;
        return next();
    } catch (error) {
        
        throw new ApiError(401, "Invalid Access Token", error);
        
    }
})



export default verifyJWT;