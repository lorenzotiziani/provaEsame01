import {Response,NextFunction} from "express";
import {AuthRequest} from "../../middleware/auth.middleware";
import {RequestsService} from "./requests.service";
import {RequestsModel} from "./requests.model.";
import {idRequirements, requestDTO} from "./requests.dto";
import {UserModel} from "../user/user.model";
import {UnauthorizedError} from "../../errors";


export class RequestsController {
	static async getRequests(req: AuthRequest, res: Response, next: NextFunction) {
		try{
			const requests=await RequestsService.getAllRequests(req.user!.userId);
			res.json({
				success:true,
				data: requests
			});
		}catch (error){
			next(error)
		}
	}

	static async getRequestDetails(req: AuthRequest, res: Response, next: NextFunction) {
		try {
			const parsed = idRequirements.parse({
				params: req.params
			});

			const { id } = parsed.params;
			const request = await RequestsModel.findById(id);

			res.json({
				success:true,
				data: request
			})
		}catch (error){
			next(error)
		}
	}

	static async insertRequest(req: AuthRequest, res: Response, next: NextFunction) {
		try {
			const data:requestDTO=req.body
			const result = await RequestsService.newRequest(req.user!.userId,data)
			res.json({
				success:true,
				data:result
			})
		}catch (error){
			next(error)
		}
	}

	static async updateRequest(req: AuthRequest, res: Response, next: NextFunction) {
		try{
			const parsed = idRequirements.parse({
				params: req.params
			});

			const { id } = parsed.params;
			const data: requestDTO=req.body


			const updatedRequest = await RequestsService.updateRequest(id,data);

			res.json({
				success:true,
				data: updatedRequest
			})
		}catch (error){
			next(error)
		}
	}
	static async deleteRequest(req: AuthRequest, res: Response, next: NextFunction) {
		try {
			const parsed = idRequirements.parse({
				params: req.params
			});

			const { id } = parsed.params;

			const deletedRequest=await RequestsService.deleteReq(id,req.user!.userId);

			res.json({
				success:true,
				data:deletedRequest
			})
		}catch (error){
			next(error)
		}
	}
	static async getToApproveRequests(req: AuthRequest, res: Response, next: NextFunction) {
		try{
			const user = await UserModel.findById(req.user!.userId);

			if(user!.role!="admin"){
				throw new UnauthorizedError("non ti è permesso accedere a questa funzione");
			}

			const toApprove= await RequestsModel.getToApprove();
			res.json({
				success:true,
				data:toApprove
			})
		}catch (error){
			next(error)
		}
	}

	static handleRequest(stato: "Approvato" | "Rifiutato") {
		return async (req: AuthRequest, res: Response, next: NextFunction) => {
			try {
				const parsed = idRequirements.parse({
					params: req.params
				});

				const {id} = parsed.params;


				const user = await UserModel.findById(req.user!.userId);
				if (user!.role != "admin") {
					throw new UnauthorizedError("non ti è permesso accedere a questa funzione");
				}

				const approve = await RequestsModel.handle(id, user!.id, stato)
				res.json({
					success: true,
					message: 'la richiesta è stata '+ stato,
					data: approve
				})
			} catch (error) {
				next(error)
			}
		}
	}
}