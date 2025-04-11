import React, { useState, useRef,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import toast from 'react-hot-toast';

const EmailVerificationPage = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    const {error,isLoading,verifyEmail} = useAuthStore();

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // Allow only numbers

        const newCode = [...code];
        newCode[index] = value.slice(-1); // Ensure single digit
        setCode(newCode);

        // Move focus to next input if a digit is entered
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e, index) => {
        if (index !== 0) {
            e.preventDefault(); // Prevent pasting from the middle
            return;
        }

        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, ""); // Remove non-digit characters
        const pastedCode = pastedData.slice(0, 6).split("");

        // Reset all inputs before pasting
        const newCode = ["", "", "", "", "", ""];

        for (let i = 0; i < 6; i++) {
            newCode[i] = pastedCode[i] || "";
        }
        setCode(newCode);

        // Focus on the last filled input or first empty one
        const lastFilledIndex = newCode.findIndex((digit) => digit === "");
        const focusIndex = lastFilledIndex !== -1 ? lastFilledIndex : 5;
        inputRefs.current[focusIndex]?.focus();
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const verificationCode = code.join("");
        

        try {
            // Trigger the login action
            await login(email, password);
            toast.success("Login successful!");
        } catch (error) {
            // Handle the error and show the error toast
            toast.error(error?.response?.data?.message || "Login failed. Please try again.");
        }
    };


    //Auto submit when all fields are filled 
    useEffect(()=>{
      if(code.every(digit => digit !=='')){
        handleSubmit(new Event('submit'));
      }
    },[code])

    return (
        <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md"
            >
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                    Verify Your Email
                </h2>
                <p className="text-center text-gray-300 mb-6">
                    Enter the 6-digit code sent to your email address.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-between">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={(e) => handlePaste(e, index)} // Prevent pasting from middle
                                className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
                            />
                        ))}
                    </div>
                    

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isLoading || code.some((digit) => !digit)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
                    >
                        {isLoading ? "Verifying..." : "Verify Email"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default EmailVerificationPage;
