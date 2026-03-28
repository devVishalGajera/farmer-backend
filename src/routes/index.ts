import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import usersRoutes from '../modules/users/users.routes';
import areasRoutes from '../modules/areas/areas.routes';
import cropsRoutes from '../modules/crops/crops.routes';
import weatherRoutes from '../modules/weather/weather.routes';
import recommendationsRoutes from '../modules/recommendations/recommendations.routes';
import marketRoutes from '../modules/market/market.routes';
import adminRoutes from '../modules/admin/admin.routes';

/** Base path for versioned REST API (mount with app.use(API_V1_PREFIX, apiV1Router)). */
export const API_V1_PREFIX = '/api/v1';

const apiV1Router = Router();

apiV1Router.use('/auth', authRoutes);
apiV1Router.use('/users', usersRoutes);
apiV1Router.use('/areas', areasRoutes);
apiV1Router.use('/crops', cropsRoutes);
apiV1Router.use('/weather', weatherRoutes);
apiV1Router.use('/recommendations', recommendationsRoutes);
apiV1Router.use('/market', marketRoutes);
apiV1Router.use('/admin', adminRoutes);

export default apiV1Router;
