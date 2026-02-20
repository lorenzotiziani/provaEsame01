import {NextFunction, Response} from 'express';
import { UserService } from './user.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import {NotFoundError} from "../../errors";

export class UserController {
  static async getProfile(req: AuthRequest, res: Response,next:NextFunction) {
    try {
      const user = await UserService.getUserById(req.user!.userId);

      if (!user) {
        throw new NotFoundError("User does not exist");
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error)
    }
  }

  static async changePassword(req: AuthRequest, res: Response,next:NextFunction) {
    try {
      const { currentPassword, newPassword } = req.body;

      await UserService.changePassword(req.user!.userId, currentPassword, newPassword);

      res.json({
        success: true,
        message: 'Password cambiata con successo'
      });
    } catch (error) {
      next(error)
    }
  }

  static async deleteAccount(req: AuthRequest, res: Response,next:NextFunction) {
    try {
      await UserService.deleteUser(req.user!.userId);

      res.json({
        success: true,
        message: 'Account eliminato con successo'
      });
    } catch (error) {
      next(error)
    }
  }

  static async getAllUsers(req: AuthRequest, res: Response,next:NextFunction) {
    try {
      const users = await UserService.getAllUsers();
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      next(error)
    }
  }

}