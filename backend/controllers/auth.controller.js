import bcryptjs from "bcryptjs"; // this is pure js bcrypt library to hash password
import crypto from "node:crypto";



import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendResetSuccessEmail,
} from "../mailtrap/emails.js";

import { User } from "../models/user.model.js";

export const signup = async (req, res, next) => {
    const { email, password, name } = req.body;

    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({ email });
        console.log("userAlreadyExists", userAlreadyExists);

        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        await user.save();

        // jwt
        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        //await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const verifyEmail = async (req, res, next) => {
    const { code } = req.body;

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid verification code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();

        // Debug email sending
        try {
            await sendWelcomeEmail(user.email, user.name);
            console.log("✅ Welcome email sent successfully");
        } catch (emailError) {
            console.error("❌ Error sending welcome email:", emailError);
        }

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...(user.toObject ? user.toObject() : user), // Safer conversion
                password: undefined,
            },
        });
    } catch (error) {
        console.error("❌ Error in verifyEmail:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User does not exist" });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Incorrect password" });
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = Date.now();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.error("❌ Error in login:", error);
        res.status(400).json({
            success: false,
            message: "Login failed",
            error: error.message,
        });
    }
};

export const logout = async (req, res, next) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logout successful" });
};

export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {

          // ✅ Check if the email is provided
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }
        
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist",
            });
        }

        //Generate reset token

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hr

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = resetTokenExpiresAt;

        await user.save();

        //send password reset email
        await sendPasswordResetEmail(
            user.email,
            `${process.env.CLIENT_URL}/reset-password/${resetToken}`
        );

        res.status(200).json({
            success: true,
            message: "Password reset email sent successfully",
        });
    } catch (error) {
        console.error("❌ Error in forgotPassword:", error);
        res.status(400).json({
            success: false,
            message: "Password reset failed",
            error: error.message,
        });
    }
};

export const resetPassword = async(req,res,next)=>{
    try {
        const {token} = req.params;
        const {password} = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid reset token" });
        }

        //update password
        const hashedPassword = await bcryptjs.hash(password,10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        //send password reset email
        await sendResetSuccessEmail(user.email, `${process.env.CLIENT_URL}/login`);

        res.status(200).json({ success: true, message: "Password reset successful" });

    } catch (error) {
        console.error("❌ Error in resetPassword:", error);
        res.status(400).json({ success: false, message: "Password reset failed", error: error.message });
    }
}

export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

