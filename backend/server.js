import express from "express";
import cors from "cors";
import dotenv from"dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json());

app.get("/", (req, res) =>{
    res.send("TaskFlow API is running.");
});

app.use("/api/auth", authRoutes);
app.use("api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`);
    });
};


startServer();