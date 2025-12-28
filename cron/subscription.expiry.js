import { cron } from 'node-cron';
import Subscription from '../models/subscription.model.js';

cron.schedule('00***', async () => {
    try {
        const statusUpdate = await Subscription.updateMany(
            {renewalDate: {$lt: new Date()}, status: 'active'},
            {status: 'expired'}
        );

        console.log(`${statusUpdate.modifiedCount} subcriptions where updated with expired`);
    } catch (error) {
        throw new Error('Cron job failed');
    }
});