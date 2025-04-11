import jwt from "jsonwebtoken";

// export const verifyToken = (req, res, next) => {
//     const token = req.cookies.token;

//     if (!token)
//         return res
//             .status(401)
//             .json({ success: false, message: "Unauthorized - no token provided" });
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         if (!decoded)
//             return res
//                 .status(401)
//                 .json({ success: false, message: "Unauthorized - invalid token" });

//         req.userId = decoded.userId;
//         next();
//     } catch (error) {
//         console.log("Error in verifyToken:", error.message);
//         if (error.name === "TokenExpiredError") {
//             return res
//                 .status(401)
//                 .json({ success: false, message: "Unauthorized - token expired" });
//         }
//         return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
//     }
// };






export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    console.log("Token in cookie:", token); // Add this to debug token retrieval

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded); // Add this to debug the token verification

        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log("Error in verifyToken:", error.message);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Unauthorized - token expired" });
        }
        return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
    }
};
