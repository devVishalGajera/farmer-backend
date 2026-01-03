import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../database';
import { ForbiddenException } from '../exceptions/app-exception';

/**
 * Role-based Access Control Guard
 * Must be used after jwtGuard
 * Usage: rolesGuard([UserRole.ADMIN])
 */
export const rolesGuard = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ForbiddenException('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenException('Insufficient permissions'));
    }

    next();
  };
};

