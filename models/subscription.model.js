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
subscriptionSchema.pre('save', async function(next){
    //Check if there is no renewal date
        if(!this.renewalDate){

        this.renewalDate = new Date(this.startDate);

        switch(this.frequency){
            case 'daily':
                this.renewalDate.setDate(this.renewalDate.getDate() + 1);
                break;
            case 'weekly':
                this.renewalDate.setDate(this.renewalDate.getDate() + 7);
                break;
            case 'monthly':
                this.renewalDate.setMonth(this.renewalDate.getMonth() + 1);
                break;
            case 'yearly':
                this.renewalDate.setFullYear(this.renewalDate.getFullYear() + 1);
                break;
            default:
                return next(new Error('Invalid subscription type'));
        }

        this.renewalDate = this.renewalDate;
    }

    //Auto-update status if renewal date has passed
    // if (this.renewalDate < new Date()) {
    //     this.status = 'expired';
    // }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;