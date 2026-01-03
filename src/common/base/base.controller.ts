import { Request, Response, NextFunction } from 'express';
import { SuccessResponse, ErrorResponse } from '../types/api-response';

/**
 * Base Controller with common response helpers
 */
export abstract class BaseController {
  /**
   * Send success response
   */
  protected success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200
  ): Response {
    const response: SuccessResponse<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send error response
   */
  protected error(
    res: Response,
    message: string,
    statusCode: number = 400,
    code?: string,
    details?: any
  ): Response {
    const response: ErrorResponse = {
      success: false,
      message,
      error: { code, details },
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send paginated response
   */
  protected paginated<T>(
    res: Response,
    message: string,
    data: T[],
    page: number,
    limit: number,
    total: number
  ): Response {
    const totalPages = Math.ceil(total / limit);
    return res.status(200).json({
      success: true,
      message,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Async handler wrapper to catch errors
   */
  protected asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}

