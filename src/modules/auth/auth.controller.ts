import { Request, Response } from 'express';
import { BaseController } from '../../common/base/base.controller';
import { validateDto } from '../../common/middleware/validation.middleware';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */
export class AuthController extends BaseController {
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  /**
   * @swagger
   * /api/v1/auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: farmer@example.com
   *               phone:
   *                 type: string
   *                 example: "+919876543210"
   *               name:
   *                 type: string
   *                 example: "John Doe"
   *               password:
   *                 type: string
   *                 format: password
   *                 minLength: 6
   *                 example: "SecurePassword123!"
   *               role:
   *                 type: string
   *                 enum: [FARMER, ADMIN]
   *                 default: FARMER
   *               stateId:
   *                 type: string
   *                 format: uuid
   *               districtId:
   *                 type: string
   *                 format: uuid
   *               villageId:
   *                 type: string
   *                 format: uuid
   *               landSize:
   *                 type: number
   *                 example: 5.5
   *               preferredCrops:
   *                 type: array
   *                 items:
   *                   type: string
   *     responses:
   *       201:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "User registered successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     accessToken:
   *                       type: string
   *                     refreshToken:
   *                       type: string
   *                     user:
   *                       type: object
   *       400:
   *         description: Bad request
   *       409:
   *         description: User already exists
   */
  register = this.asyncHandler(async (req: Request, res: Response) => {
    const dto = req.body as RegisterDto;
    const result = await this.authService.register(dto);
    return this.success(res, 'User registered successfully', result, 201);
  });

  /**
   * @swagger
   * /api/v1/auth/login:
   *   post:
   *     summary: Login user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: farmer@example.com
   *               phone:
   *                 type: string
   *                 example: "+919876543210"
   *               password:
   *                 type: string
   *                 format: password
   *                 example: "SecurePassword123!"
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Login successful"
   *                 data:
   *                   type: object
   *                   properties:
   *                     accessToken:
   *                       type: string
   *                     refreshToken:
   *                       type: string
   *                     user:
   *                       type: object
   *       401:
   *         description: Invalid credentials
   */
  login = this.asyncHandler(async (req: Request, res: Response) => {
    const dto = req.body as LoginDto;
    const result = await this.authService.login(dto);
    return this.success(res, 'Login successful', result);
  });

  /**
   * @swagger
   * /api/v1/auth/refresh:
   *   post:
   *     summary: Refresh access token
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - refreshToken
   *             properties:
   *               refreshToken:
   *                 type: string
   *     responses:
   *       200:
   *         description: Token refreshed successfully
   *       401:
   *         description: Invalid refresh token
   */
  refreshToken = this.asyncHandler(async (req: Request, res: Response) => {
    const dto = req.body as RefreshTokenDto;
    const result = await this.authService.refreshToken(dto);
    return this.success(res, 'Token refreshed successfully', result);
  });

  /**
   * @swagger
   * /api/v1/auth/logout:
   *   post:
   *     summary: Logout user
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - refreshToken
   *             properties:
   *               refreshToken:
   *                 type: string
   *     responses:
   *       200:
   *         description: Logout successful
   *       401:
   *         description: Unauthorized
   */
  logout = this.asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    await this.authService.logout(refreshToken);
    return this.success(res, 'Logout successful');
  });
}

