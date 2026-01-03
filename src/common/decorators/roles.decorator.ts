import { UserRole } from '../../database';

/**
 * Roles decorator to specify allowed roles for a route
 * Usage: @Roles(UserRole.ADMIN, UserRole.FARMER)
 */
export const Roles = (...roles: UserRole[]) => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      Reflect.defineMetadata('roles', roles, descriptor.value);
    } else {
      Reflect.defineMetadata('roles', roles, target);
    }
  };
};

