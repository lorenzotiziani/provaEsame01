import {Request,Response,NextFunction} from "express";
import {CategoriesService} from "./categories.service";


export class CategoriesController {
	static async getCategories(req: Request, res: Response, next: NextFunction) {
		try{
			const categories= await CategoriesService.getAllCategories();

			res.json({
				success: true,
				data: categories
			});
		}catch(err){

		}
	}
}