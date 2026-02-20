import { Router } from 'express';
import {authMiddleware} from "../../middleware/auth.middleware";
import {CategoriesController} from "./categories.controller";

const router = Router();

router.use(authMiddleware);

router.get('/',CategoriesController.getCategories);

export default router;