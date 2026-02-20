import {Request} from '../entities/requestsEntity'
import {UserModel} from "../user/user.model";
import {NotFoundError, UnauthorizedError} from "../../errors";
import {RequestsModel} from "./requests.model.";
import {requestDTO} from "./requests.dto";
import {CategoriesService} from "../categories/categories.service";

export class RequestsService {
	static async getAllRequests(userId:number): Promise<Request[]> {
		const user = await UserModel.findById(userId);

		if (user!.role !== "admin" && user!.role !== "dipendente") {
			throw new UnauthorizedError("gli utenti senza ruoli non sono autorizzati");
		}

		return await RequestsModel.find(userId, user!.role);
	}

	static async newRequest(userId:number,data:requestDTO): Promise<Request> {
		const category= await CategoriesService.getById(data.categoriaId);
		if (!category) {
			throw new NotFoundError("categoria non esistente")
		}

		return await RequestsModel.create(
			data,
			userId,
		);
	}

	static async updateRequest(requestId:number,data:requestDTO): Promise<Request> {
		const category= await CategoriesService.getById(data.categoriaId);
		if (!category) {
			throw new NotFoundError("categoriìa non esistente")
		}

		const richiesta=await RequestsModel.findById(requestId);

		if (!richiesta) {
			throw new NotFoundError("richiesta non esistente")
		}
		if(richiesta.stato!="In attesa"){
			throw new UnauthorizedError("la richiesta non può essere modificata")
		}
		return await RequestsModel.update(
			requestId,
			data,
		)
	}

	static async deleteReq(requestId:number,userId:number): Promise<Request> {
		const richiesta=await RequestsModel.findById(requestId);
		if (!richiesta) {
			throw new NotFoundError("richiesta non esistente")
		}
		if(richiesta.utenteId!=userId){
			throw new UnauthorizedError("la richiesta non ti appartiene")
		}
		if(richiesta.stato!="In attesa"){
			throw new UnauthorizedError("la richiesta non può essere modificata")
		}

		return await RequestsModel.delete(requestId);
	}
}