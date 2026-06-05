import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function authMiddleware(req, res, next) {
  
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false,
            message: 'Unauthorized' 
        });
    }
    const token = authHeader.split(' ')[1];   
    try { 
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(payload.id);
        if(!user){
            return res.status(401).json({
                success: false,
                message: 'User not found'
            })
        }
        req.user = user;
        next();
    } 
    catch (error) {
        console.error('JWT Verification Failed:', error);
        return res.status(401).json({ 
            success: false,
            message: 'Token Invalid or Expired ' 
        });
  }
};
