import { Router } from 'express';
import { createSubscription, getSubscriptions, getUserSubscription } from '../controllers/subscription.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', authorize('admin'), getSubscriptions);

subscriptionRouter.get('/:id', authenticate, authorize('user'), getUserSubscription);

subscriptionRouter.post('/', authenticate, createSubscription);

subscriptionRouter.put('/:id', (req, res) => res.send({title: 'UPDATE subscription by ID'}));

subscriptionRouter.delete('/:id', (req, res) => res.send({title: 'DELETE subscription by ID'}));

subscriptionRouter.get('/user/:id', (req, res) => res.send({title: 'GET user subscription by ID'}));

subscriptionRouter.put('/:id/cancel', (req, res) => res.send({title: 'CANCEL subscription'}));

subscriptionRouter.post('/upcoming-renewals', (req, res) => res.send({title: 'GET upcoming subscription renewals'}));

export default subscriptionRouter;