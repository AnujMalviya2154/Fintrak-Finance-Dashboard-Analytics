import User from '../models/userModel.js';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES = '24h';
const createToken = (userId) => {
    return jwt.sign({id: userId}, JWT_SECRET, {expiresIn: TOKEN_EXPIRES});
}

//REGISTER A USER
export async function registerUser(req,res){
    const {name,email,password} = req.body;
    if(!name||!email||!password){
        return res.status(400).json({
            success: false,
            message: "Please fill all the fields"
        });
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email"
        });
    }
    if(password.length<8){
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long"
        });
    }
    try{
        if(await User.findOne({email})){
            return res.status(409).json({
                success: false,
                message: "User already exists"
            })
        }
        const hashed = await bcrypt.hash(password,10);
        const user = await User.create({ name, email, password: hashed});
        const token  = createToken(user._id);
        res.status(201).json({
            success: true,
            token,
            user: {id: user._id, name: user.name, email: user.email},
            message: "User registered successfully"
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

//LOGIN A USER

export async function loginUser(req,res){
    const {email,password} = req.body;
    if(!email||!password){
        return res.status(400).json({
            success: false,
            message: "Both fields are required"
        })
    }
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const token = createToken(user._id);
        res.status(200).json({
            success: true,
            token,
            user: {id: user._id, name: user.name, email: user.email},
            message: "User logged in successfully"
        }); 
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

//GET USER DETAILS
export async function getCurrentUser(req,res){
    try{
        const user = await User.findById(req.user._id).select("name email");
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.json({success: true, user});
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

//UPDATE USER PROFILE
export async function updateProfile(req,res){
    const {name, email} = req.body;
    if(!name||!email||!validator.isEmail(email)){
        return res.status(400).json({
            success: false,
            message: "Please fill all the fields with valid information"
        });
    }
    try{
        const exists = await User.findOne({email, _id:{$ne: req.user._id}});
        if(exists){
            return res.status(409).json({
                success: false,
                message: "Email already in use by another account"
            });
        }
        const user = await User.findByIdAndUpdate(req.user._id, {name, email}, {new: true, runValidators: true}).select("name email");
        res.json({
            success: true,
            user,
            message: "Profile updated successfully"
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }   
}

//CHANGE PASSWORD
export async function changePassword(req,res){
    const {currentPassword, newPassword} = req.body;
    if(!currentPassword||!newPassword|| newPassword.length<8){
        return res.status(400).json({
            success: false,
            message: "Password is Invalid or too short" 
        });

    }
    try{
        const user = await User.findById(req.user._id).select("password");
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const match = await bcrypt.compare(currentPassword, user.password);
        if(!match){
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }
        
        user.password = await bcrypt.hash(newPassword,10);
        await user.save();
        res.json({
            success: true,
            message: "Password changed successfully"
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}