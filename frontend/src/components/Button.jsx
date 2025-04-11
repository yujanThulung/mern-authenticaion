import React from "react";
import {motion} from 'framer-motion'
import { Loader } from "lucide-react";

const Button = ({children,disabled,isLoading,onClick}) => {
    return (
        <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold rounded-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={disabled}
            style={{minWidth:'100%'}}
            onClick={onClick}
        >
            {isLoading ? (
                <div className="absolute inset-0 flex justify-center items-center">
                    <Loader className="animate-spin text-white " />
                </div>
            ) : (
                children
            )}
        </motion.button>
    );
};

export default Button;
