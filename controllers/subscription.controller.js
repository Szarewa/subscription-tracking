import Subscription from '../models/subscription.model.js';

export const createSubscription = async (req, res, next) => {
    try {

        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        });

        res.status(201).json({ success: true, message: "User created successfully", data: subscription })

    } catch (error) {
        next(error);
    }
}

export const getSubscriptions = async (req, res, next) => {

    try {
        const subscriptions = await Subscription.find();

        if(!subscriptions){
            const error = new Error('No subscription found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({success: true, data: subscriptions});

    } catch (error) {
        next(error);
    }
}

export const getUserSubscription = async (req, res, next) => {

    try {
        const subscription = await Subscription.findById(req.params.id);

        if(!subscription){
            const error = new Error('No subscription found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({success: true, message: 'Hellooo', data: subscription});

    } catch (error) {
        next(error);
    }
}