import { Request, Response, NextFunction } from 'express';
import { AppException } from '../exceptions/app-exception';
import { ErrorResponse } from '../types/api-response';
import { ValidationError } from 'class-validator';

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (
  err: Error | AppException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle known application exceptions
  if (err instanceof AppException) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: err.message,
      error: {
        code: err.code,
        details: err.details,
      },
      timestamp: new Date().toISOString(),
    };

    return res.status(err.statusCode).json(errorResponse);
  }

  // Handle validation errors (from class-validator)
  if (Array.isArray((err as any).errors) && (err as any).errors.length > 0) {
    const validationErrors = (err as any).errors as ValidationError[];
    const details = validationErrors.map((error) => ({
      property: error.property,
      constraints: error.constraints,
    }));

    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      error: {
        code: 'VALIDATION_ERROR',
        details,
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Handle unknown errors
  const errorResponse: ErrorResponse = {
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
    timestamp: new Date().toISOString(),
  };

  return res.status(500).json(errorResponse);
};

