import {Router} from 'express';
import authRouter from './api/auth/auth.routes';
import userRouter from './api/user/user.routes';
import requestsRouter from "./api/requests/requests.router";
import categoriesRouter from "./api/categories/categories.router";

const router=Router();

router.use('/auth',authRouter)
router.use('/users',userRouter)
router.use('/requests',requestsRouter)
router.use('/categories',categoriesRouter)


export default router;