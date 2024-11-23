import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { Admin } from "../models/admin.model.js";

export const verifyAdminJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log("TOKEN:", token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET)
    
        const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!admin) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.admin = admin;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})