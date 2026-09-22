import { AuthUser, Permission, UserRole, ROLE_PERMISSIONS } from './types';

export function hasPermission(user: AuthUser | null | undefined, permission: Permission): boolean {
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN') return true;
  const permissions = user.permissions || ROLE_PERMISSIONS[user.role] || [];
  return permissions.includes(permission);
}

export function hasRole(user: AuthUser | null | undefined, role: UserRole): boolean {
  if (!user) return false;
  return user.role === role;
}

export function hasAnyRole(user: AuthUser | null | undefined, roles: UserRole[]): boolean {
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN') return true;
  return roles.includes(user.role);
}

export function canAccessPortal(
  user: AuthUser | null | undefined,
  portal: 'admin' | 'partner' | 'developer' | 'public'
): boolean {
  if (portal === 'public') return true;
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN') return true;

  switch (portal) {
    case 'admin':
      return ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER', 'SALES_EXECUTIVE'].includes(user.role);
    case 'partner':
      return ['SUPER_ADMIN', 'CHANNEL_PARTNER'].includes(user.role);
    case 'developer':
      return ['SUPER_ADMIN', 'DEVELOPER'].includes(user.role);
    default:
      return false;
  }
}

export function getRoleBadgeStyle(role: UserRole): { label: string; badgeClass: string } {
  switch (role) {
    case 'SUPER_ADMIN':
      return { label: 'Super Admin', badgeClass: 'bg-red-100 text-red-800 border-red-200' };
    case 'ADMIN':
      return { label: 'Operations Admin', badgeClass: 'bg-amber-100 text-amber-800 border-amber-200' };
    case 'SALES_MANAGER':
      return { label: 'Sales Manager', badgeClass: 'bg-purple-100 text-purple-800 border-purple-200' };
    case 'SALES_EXECUTIVE':
      return { label: 'Sales Exec', badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
    case 'DEVELOPER':
      return { label: 'Developer Rep', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    case 'CHANNEL_PARTNER':
      return { label: 'Channel Partner', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'CUSTOMER':
      return { label: 'Verified Buyer', badgeClass: 'bg-neutral-100 text-neutral-800 border-neutral-200' };
  }
}
