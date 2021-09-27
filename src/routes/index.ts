import { Router } from 'express';
import { getAllUsers, addOneUser, updateOneUser, deleteOneUser } from './Users';
import { redirectToSSO } from './OpenID';


// User-route
const userRouter = Router();
userRouter.get('/all', getAllUsers);
userRouter.post('/add', addOneUser);
userRouter.put('/update', updateOneUser);
userRouter.delete('/delete/:id', deleteOneUser);

// Telegram Bot Registration Route
const openidRouter = Router();
openidRouter.get('/reg/:id', redirectToSSO)


// Export the base-router
const baseRouter = Router();
baseRouter.use('/users', userRouter);
export default baseRouter;
