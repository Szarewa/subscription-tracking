import jwt from 'jasonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

export const signUp = async (req, res, next) => {
    const { name, email, password } = req.body;

    const isUserValid = User.findone({ email });

    if(!isUserValid) {
        
    }
}

export const signIn = async (req, res, next) => {}

export const signOut = async (req, res, next) => {}