import { Router } from 'express';
import {authMiddleware} from "../../middleware/auth.middleware";
import {validate} from "../../middleware/validate.middleware";
import {RequestsController} from "./requests.controller";
import {idRequirements, requestRequirements} from "./requests.dto";

const router = Router();

router.use(authMiddleware);

router.get('/toApprove', RequestsController.getToApproveRequests)
router.get('/:id', validate(idRequirements), RequestsController.getRequestDetails)
router.get('/', RequestsController.getRequests)

router.put('/:id/approve', validate(idRequirements), RequestsController.handleRequest("Approvato"))
router.put('/:id/reject', validate(idRequirements), RequestsController.handleRequest("Rifiutato"))

router.put('/:id', validate(idRequirements), validate(requestRequirements), RequestsController.updateRequest)

router.delete('/:id', validate(idRequirements), RequestsController.deleteRequest)

router.post('/', validate(requestRequirements), RequestsController.insertRequest)



export default router;