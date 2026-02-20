import sql from 'mssql';
import { getPool } from '../../config/database';
import { User } from '../entities/authEntity';

export class UserModel {
  static async findById(id: number): Promise<User | null> {
    const pool = getPool();
    const request = pool.request();

    const result = await request
        .input('id', sql.Int, id)
        .query(`
          SELECT id, email, password, nome, cognome, role
          FROM TUtente
          WHERE id = @id
        `);

    return result.recordset[0] || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const pool = getPool();
    const request = pool.request();

    const result = await request
        .input('email', sql.VarChar(255), email)
        .query(`
          SELECT id, email, password, nome, cognome, role
          FROM TUtente
          WHERE email = @email
        `);

    return result.recordset[0] || null;
  }

  static async create(userData: Omit<User, 'id'>): Promise<User> {
    const pool = getPool();
    const request = pool.request();

    const result = await request
        .input('email', sql.VarChar(255), userData.email)
        .input('password', sql.VarChar(255), userData.password)
        .input('firstName', sql.VarChar(100), userData.nome)
        .input('lastName', sql.VarChar(100), userData.cognome)
        .input('role', sql.Bit, userData.role)
        .query(`
          INSERT INTO TUtente (email, password, nome, cognome, role)
            OUTPUT INSERTED.*
          VALUES (@email, @password, @firstName, @lastName, @role)
        `);

    return result.recordset[0];
  }

  static async update(id: number, userData: Partial<User>): Promise<User | null> {
    const pool = getPool();
    const request = pool.request();

    let setClause = [];
    let inputs: any = { id };

    if (userData.nome !== undefined) {
      setClause.push('nome = @nome');
      inputs.nome = userData.nome;
    }
    if (userData.cognome !== undefined) {
      setClause.push('cognome = @cognome');
      inputs.cognome = userData.cognome;
    }
    if (userData.email !== undefined) {
      setClause.push('email = @email');
      inputs.email = userData.email;
    }
    if (userData.password !== undefined) {
      setClause.push('password = @password');
      inputs.password = userData.password;
    }
    if (userData.role !== undefined) {
      setClause.push('role = @role');
      inputs.role = userData.role;
    }


    // Se non ci sono campi da aggiornare, restituisci l'utente corrente
    if (setClause.length === 0) {
      return this.findById(id);
    }

    Object.keys(inputs).forEach(key => {
      if (key === 'id') {
        request.input(key, sql.Int, inputs[key]);
      } else {
        request.input(key, sql.VarChar(255), inputs[key]);
      }
    });

    const result = await request.query(`
      UPDATE TUtente
      SET ${setClause.join(', ')}
        OUTPUT INSERTED.*
      WHERE id = @id
    `);

    return result.recordset[0] || null;
  }

  static async findAll(): Promise<User[]> {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT id, email, nome, cognome, role
      FROM TUtente
      ORDER BY id ASC
    `);

    return result.recordset;
  }

  static async delete(id: number): Promise<void> {
    const pool = getPool();
    await pool.request()
        .input('userId', sql.Int, id)
        .query(`
          DELETE FROM RefreshTokens
          WHERE userId = @userId
        `);

    await pool.request()
        .input('id', sql.Int, id)
        .query(`
          DELETE FROM TUtente
          WHERE id = @id
        `);
  }
}