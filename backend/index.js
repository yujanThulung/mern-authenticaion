import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors  from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import "./mailtrap/mailtrap.config.js";


dotenv.config();




const PORT = process.env.PORT || 5000;


console.log(process.env.MONGO_URI);
console.log(process.env.PORT)



const app = express();

app.use(cors({
    origin:"http://localhost:5173",credentials:true}));


app.use(express.json());//allows us to parse incoming json data
app.use(cookieParser());//allows us to parse incoming cookie data



app.use("/api/auth",authRoutes);


app.listen(PORT,()=>{
    connectDB();
    console.log(`Server running on port http://localhost:${PORT}`);
});


