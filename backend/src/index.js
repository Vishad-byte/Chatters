import express from "express";
import dotenv from "dotenv"
import { connect } from "mongoose";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { errorHandler } from "./middleware/errorHandler.js";
import { app,server } from "./lib/socket.js";
import path from "path";


dotenv.config();


const PORT = process.env.PORT;
const __dirname = path.resolve()

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

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}



connectDB()
.then( () => {
    server.listen(PORT, () => {
        console.log(`Server is running on the PORT: ${PORT}`)});
        app.on("Error", (err) => {
            console.error("Express application error:", err);
        });
})
.catch( (err) => {
    console.error("MongoDB connection connection failed" ,err);
})



