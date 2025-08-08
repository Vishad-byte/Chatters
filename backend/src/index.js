import express from "express";
import dotenv from "dotenv"
import { connect } from "mongoose";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { errorHandler } from "./middleware/errorHandler.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

//Router imports
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";

//Router declaration
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messages", messageRoutes);

app.use(errorHandler);



connectDB()
.then( () => {
    app.listen(PORT, () => {
        console.log(`Server is running on the PORT: ${PORT}`)});
        app.on("Error", (err) => {
            console.error("Express application error:", err);
        });
})
.catch( (err) => {
    console.error("MongoDB connection connection failed" ,err);
})