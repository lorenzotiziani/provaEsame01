import {getPool} from "../../config/database";
import sql, {query} from "mssql";
import {requestDTO} from "./requests.dto";

export class RequestsModel {
	static async find(userId:number,role:string){
		const pool=getPool();
		const request=pool.request()

		let whereClause='';

		if(role=="dipendente"){
			whereClause='WHERE utenteId=@userId';
			request.input('userId', sql.Int, userId);
		}

		const result =await request.query(`
			SELECT * FROM RichiestaPermesso 
			${whereClause} 
		 	ORDER BY dataRichiesta DESC
		`);
		return result.recordset;
	}

	static async findById(id:number){
		const pool=getPool();
		const request=pool.request()

		const result=await request
			.input('id',sql.Int,id)
			.query(`
				SELECT * 
				FROM RichiestaPermesso
				WHERE id=@id
			`)
		return result.recordset[0];
	}

	static async create(data: requestDTO, userId: number) {
		const pool = getPool();
		const request = pool.request();

		const result = await request
			.input('dataRichiesta', sql.Date, new Date())
			.input('dataInizio', sql.Date, data.dataInizio)
			.input('dataFine', sql.Date, data.dataFine)
			.input('categoriaId', sql.Int, data.categoriaId)
			.input('motivazione', sql.NVarChar, data.motivazione)
			.input('stato', sql.NVarChar, "In attesa")
			.input('utenteId', sql.Int, userId)
			.query(`
          INSERT INTO RichiestaPermesso
          (dataRichiesta, dataInizio, dataFine, categoriaId, motivazione, stato, utenteId)
              OUTPUT INSERTED.*
          VALUES
              (@dataRichiesta, @dataInizio, @dataFine, @categoriaId, @motivazione, @stato, @utenteId)
			`);

		return result.recordset[0];
	}

	static async update(richiestaId: number,data: requestDTO) {
		const pool = getPool();
		const request = pool.request();

		const result = await request
			.input('dataInizio', sql.Date, data.dataInizio)
			.input('dataFine', sql.Date, data.dataFine)
			.input('categoriaId', sql.Int, data.categoriaId)
			.input('motivazione', sql.NVarChar, data.motivazione)
			.input('id', sql.Int, richiestaId)
			.query(`
          UPDATE RichiestaPermesso
          SET dataInizio = @dataInizio,
              dataFine = @dataFine,
              categoriaId = @categoriaId,
              motivazione = @motivazione
              OUTPUT INSERTED.*
          WHERE id = @id
			`);

		return result.recordset[0];
	}
	static async delete(requestId:number){
		const pool = getPool();
		const request = pool.request();
		const result = await request
			.input('id', sql.Int, requestId)
			.query(`
				DELETE FROM RichiestaPermesso
						OUTPUT DELETED.*
				WHERE id=@id
			`)
		return result.recordset[0];
	}
	static async getToApprove(){
		const pool = getPool();
		const request = pool.request();
		const result = await request
			.query(`
				SELECT * 
				FROM RichiestaPermesso 
				WHERE stato='In attesa'
			`)
		return result.recordset;
	}
	static async handle(requestId:number,id: number,stato:string): Promise<void> {
		const pool = getPool();
		const request = pool.request();
		const result = await request
			.input('utenteValutazione', sql.Int, id)
			.input('dataValutazione', sql.Date,new Date())
			.input('id', sql.Int, requestId)
			.input('stato', sql.NVarChar, stato)
			.query(`
        UPDATE RichiestaPermesso 
        SET utenteValutazione=@utenteValutazione,dataValutazione=@dataValutazione,stato=@stato
        WHERE id=@id
      `)
	}

}