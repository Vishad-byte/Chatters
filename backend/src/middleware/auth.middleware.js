import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../lib/ApiError.js";
import { asyncHandler } from "../lib/asyncHandler.js";

export const protectRoute = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            throw new ApiError(401, "Unauthorized request - no token provided");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            throw new ApiError(401, "Unauthorized request - invalid token")
        }

        const user = await User.findById(decoded?.userId).select("-password");
        if(!user){
            throw new ApiError(401, "User not found while authentication");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid jwt or error in protect middleware")
    }
})