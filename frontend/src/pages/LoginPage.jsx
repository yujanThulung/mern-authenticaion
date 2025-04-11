import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import Input from "../components/Input";
import Button from "../components/Button";
import { useAuthStore } from "../../store/authStore";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {login,isLoading,error} = useAuthStore();

    const handleLogin = async(e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success("Login successful");
        } catch (error) {
            toast.error((error?.response?.data?.message || "Unknown error"));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden"
        >
            <div className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                    Welcome Back
                </h2>

                <form onSubmit={handleLogin}>
                    <Input
                        icon={Mail}
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        icon={Lock}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="flex items-center mb-6">
                        <Link
                            to="/forgot-password"
                            className="text-sm text-green-400 hover:underline "
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button  
                    disabled= {isLoading}
                    >
                      {isLoading ?<Loader className="size-6 animate-spin mx-auto"/>:"Login"}
                    </Button>

                    
                </form>
            </div>

            <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
                <p className="text-sm text-gray-400">
                    Don't have an account?{" "}
                    <Link to={"/signup"} className="text-green-400 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </motion.div>
    );
};

export default LoginPage;
