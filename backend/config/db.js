import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        if (!conn) {
            console.log(`MongoDB not connected`);
        } else {
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        }
    } catch (err) {
        console.log("Error connection to MongoDB", err.message);
        process.exit(1); // 1 is failure
    }
};
