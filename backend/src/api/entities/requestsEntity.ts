export interface Request {
	id:number;
	dataRichiesta:Date;
	dataInizio:Date;
	dataFine:Date;
	categoriaId:number;
	motivazione:string;
	stato:string;
	utenteId:number;
	dataValutazione:Date;
	utenteValutazione:number;
}