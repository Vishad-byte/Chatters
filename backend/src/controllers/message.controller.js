import { ApiError } from "../lib/ApiError.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = asyncHandler(async(req, res) => {
    try {
        const loggedInUserId = req.user?._id;
        const filteredUsers = await User.find({ _id: { $ne : loggedInUserId } }).select("-password");
    
        res.status(200).json(filteredUsers);
    } catch (error) {
        throw new ApiError(500, error?.message || "Internal server error")
    };
});