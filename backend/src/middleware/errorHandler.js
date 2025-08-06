import { ApiError } from "../lib/ApiError.js";

export const errorHandler = (err, req, res, next) => {
    console.log("Error caught by middleware:", err.message);
    
    // If it's our custom ApiError instance
    if (err instanceof ApiError || err.statusCode) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message,
            errors: err.errors || []
        });
    }
    
    // Handle other types of errors
    console.error("Unhandled error:", err);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
};
