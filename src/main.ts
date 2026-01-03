import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/env';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './common/middleware/error-handler';
import { NotFoundException } from './common/exceptions/app-exception';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Farmer Advisory Platform API Docs',
  swaggerOptions: {
    persistAuthorization: true, // Persist JWT token in Swagger UI
  },
}));

// Swagger JSON endpoint
app.get('/api/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Farmer Advisory Platform API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import areasRoutes from './modules/areas/areas.routes';
import cropsRoutes from './modules/crops/crops.routes';
import weatherRoutes from './modules/weather/weather.routes';
import recommendationsRoutes from './modules/recommendations/recommendations.routes';
import marketRoutes from './modules/market/market.routes';
import adminRoutes from './modules/admin/admin.routes';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/areas', areasRoutes);
app.use('/api/v1/crops', cropsRoutes);
app.use('/api/v1/weather', weatherRoutes);
app.use('/api/v1/recommendations', recommendationsRoutes);
app.use('/api/v1/market', marketRoutes);
app.use('/api/v1/admin', adminRoutes);

// 404 handler
app.use((req, res, next) => {
  next(new NotFoundException(`Route ${req.method} ${req.path} not found`));
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server is running on http://localhost:${config.port}`);
  console.log(`📚 Swagger docs will be available at http://localhost:${config.port}/api/docs`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
});

