import { ApiError } from "../lib/ApiError.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
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
    } catch (error) {
    console.error("Error in signup controller:", error);
    throw new ApiError(500, error.message || "Error in signup controller");
}

}

export const login = (req, res) =>{
    res.send("login route")
}

export const logout = (req, res) =>{
    res.send("logout route")
}