import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../models/user.model.js';

const authorization = async (req, res, next) => {
    try {
        let token, validId;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token) return res.status(401).json({ success: false, message: 'No tokrn, Unauthorized'});

        const verifiedToken = jwt.verify(token, JWT_SECRET);

        // if(verifiedToken.userId === req.params.id) {
        //     validId = verifiedToken.userId
        // }

        const user = await User.findById(verifiedToken.userId);

        if(!user) return res.status(401).json({ success: false, message: 'No user, Unauthorized'});

        req.user = user;

        next();
    } catch (error) {
       next(error);
    }
}

export default authorization;