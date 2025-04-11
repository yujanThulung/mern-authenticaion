import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
    if (!res || typeof res.cookie !== "function") {
        throw new Error("Response object does not support cookies");
    }

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
    
    // console.log("🟢 Token Generated:", token);
    // console.log("🟢 Setting Cookie...");

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false, // Secure only in production
        sameSite: "lax", // More flexible than "strict"
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });


    return token;
};
