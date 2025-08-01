import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv"
import { connect } from "mongoose";
import connectDB from "./lib/db.js";

dotenv.config()
const app = express();
const PORT = process.env.PORT

app.use("/api/auth", authRoutes);


connectDB()
.then( () => {
    app.listen(PORT, () => {
        console.log(`Server is running on the PORT: ${PORT}`)});
        app.on("Error", (err) => {
            console.error("Express application error:", err)
        })
})
.catch( (err) => {
    console.error("MongoDB connection connection failed" ,err);
})