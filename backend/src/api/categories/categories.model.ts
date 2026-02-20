import sql from 'mssql'
import {getPool} from '../../config/database'
import {Category} from "../entities/categoriesEntity";

export class CategoriesModel{
	static async findAll():Promise<Category[]>{
		const pool = getPool();
		const result = await pool.request().query(`
			SELECT id,descrizione 
			FROM CategoriaPermesso 
			ORDER BY id ASC;
		`);

		return result.recordset;
	}
	static async getById(id:number):Promise<Category>{
		const pool = getPool();
		const result = await pool.request()
			.input('id',sql.Int,id)
			.query(`
				SELECT * 
				FROM CategoriaPermesso 
				WHERE id = @id;
			`)
		return result.recordset[0];
	}
}