import userModal from "../models/User.js";

// Middleware to authenticate admin
export const authenticateAdmin = async (req, res, next) => {
    try {
      const admin_id = req.params.admin_id;
      const user = await userModal.findById(admin_id);

      if (user && user.role === 'admin') {
        next();
      } else {
        return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };