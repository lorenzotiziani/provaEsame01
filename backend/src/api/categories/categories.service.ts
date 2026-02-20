import {CategoriesModel} from "./categories.model";

export class CategoriesService {
	static async getAllCategories() {
		return await CategoriesModel.findAll();
	}

	static async getById(id:number) {
		return await CategoriesModel.getById(id);
	}
}