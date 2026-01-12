import { Router } from 'express';
import { getUser, getUsers} from '../controllers/user.controller.js';
import authorization from '../middlewares/authorization.js';

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/:id', authorization, getUser);

userRouter.post('/', (req, res) => res.send({title: 'CREATE new user'}));

userRouter.put('/:id', (req, res) => res.send({title: 'UPDATE user by ID'}));

userRouter.delete('/:id', (req, res) => res.send({title: 'DELETE user by ID'}));

export default userRouter;