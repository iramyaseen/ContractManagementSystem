import userModal from "../models/User.js";

// Middleware to authenticate admin
export const authenticateUser = async (req, res, next) => {
    try {
        const { email } = req.body;
        const ExitsUser = await userModal.findOne({ email: email });

        if (!ExitsUser) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }

        if (ExitsUser && ExitsUser.status === 'active') {
            next();
        } else {
            return res.status(403).json({ message: 'Email id is blocked by admin' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};