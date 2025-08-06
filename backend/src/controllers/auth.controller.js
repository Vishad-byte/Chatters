import { ApiError } from "../lib/ApiError.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = asyncHandler (async (req, res) => {
  const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
    //   return res.status(400).json({ message: "All fields are required" });
        throw new ApiError(400, "All the fields are required");
    }

    if (password.length < 6) {
    //   return res.status(400).json({ message: "Password must be at least 6 characters" });
        throw new ApiError(400, "Length of the password should be greater than 6");
    }

    const user = await User.findOne({ email });
    if (user) {
        throw new ApiError(400, "Username already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        fullName,
        email,
        password: hashedPassword
    });

    if(newUser) {
        generateToken(newUser._id, res);
        await newUser.save();

        res.status(201)
        .json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic
        })
    }
    else {
        // res.status(400).json({message: "Invalid user data"});
        throw new ApiError(400, "Invalid User data")
    }

})

export const login = asyncHandler (async (req, res) =>{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user){
        console.log("Throwing: This user is not registered");
        throw new ApiError(401, "This user is not registered")
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
        console.log("Throwing: Invalid credentials"); // Debug log
        throw new ApiError(401, "Invalid credentials")
    }

    generateToken(user._id, res);

    res.status(200)
    .json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic
    });
});


// export const logout = asyncHandler (async(req, res) =>{
//     res.send("logout route")
// })
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = asyncHandler(async(req,res) => {
    const { profilePic } = req.body;
    const userId = req.user._id;             // got this from the auth middleware

    if(!profilePic){
        throw new ApiError(400, "Profile pic is required")
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic, {resource_type: "auto"});
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url },
        { new: true }
    );
    if(!updatedUser){
        throw new ApiError(400, "Errors while updating the user")
    }
    res.status(200).json(updatedUser);
})

export const checkAuth = asyncHandler(async(req,res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        throw new ApiError(500, error?.message || "error in checkAuth controller")
    }
})