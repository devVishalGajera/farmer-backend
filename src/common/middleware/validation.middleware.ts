import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationException } from '../exceptions/app-exception';

/**
 * Validation middleware factory
 * Validates request body against a DTO class
 */
export const validateDto = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Transform plain object to class instance
    const dto = plainToInstance(dtoClass, req.body);

    // Validate
    const errors: ValidationError[] = await validate(dto, {
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error for non-whitelisted properties
    });

    if (errors.length > 0) {
      const details = errors.map((error) => ({
        property: error.property,
        constraints: error.constraints,
      }));

      return next(new ValidationException('Validation failed', details));
    }

    // Attach validated DTO to request
    req.body = dto;
    next();
  };
};

