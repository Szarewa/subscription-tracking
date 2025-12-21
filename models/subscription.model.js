import mongoose from 'mongoose';

const subscriptionSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be greater than 0']
    },
    currency: {
        type: String,
        enum: ['NGN', 'USD', 'GBP', 'EUR'],
        default: 'NGN'
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekely', 'monthly', 'yearly']
    },
    category: {
        type: String,
        enum: ['technology', 'sports', 'entertainment', 'news', 'lifestyle', 'politics'],
        required: true
    },
    paymentMethod: {
        type: String,
        trim: true,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start date must be in the past'
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function(value){
                return value > this.startDate
            },
            message: 'Renewal date must be after the start date'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true //This will optimize the query by indexing the user field
    }
}, {timestamps: true});

//This function runs before saving the document
subscriptionSchema.pre('save', function (next){
    //Check if there is no renewal date
    if(!this.renewalDate){
        const renewalPeriods = {
            daily: 1, weekly: 7, monthly: 30, yearly: 365
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    //Auto-update status if renewal date has passed
    if (this.renewalDate < new Date()) {
        this.status = 'expired';
    }

    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default subscriptionSchema;