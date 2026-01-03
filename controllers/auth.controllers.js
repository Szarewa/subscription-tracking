import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';

export const signUp = async (req, res, next) => {
   const session = await mongoose.startSession();
   session.startTransaction();

   try {
         const { name, email, password } = req.body;

         const existingUser = await User
            .findOne({ email})
            .session(session);

         if(existingUser) {
            const error = new Error('User Already exists');
            error.statusCode = 409;
            throw error;
         }

         const hashedPass = await bcrypt.hash(password, 10);

         const newUser = await User.create([{name, email, password: hashedPass}], { session });

         const token = jwt.sign({userId: newUser[0]._id}, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User created suceessfully',
            data: {
                token, 
                user: newUser[0]
            }
        });

   } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
   } 
}

export const signIn = async (req, res, next) => {
    try {
        
        const { email, password } = req.body

        const user = await User.findOne({ email });

        if(!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
       
        const isPassword = await bcrypt.compare(password, user.password);

        if(!isPassword) {
            const error = new Error('Invalid password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN});

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user
            }
        });

    } catch (error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {}