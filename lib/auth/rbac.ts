import { AuthUser, Permission, UserRole, ROLE_PERMISSIONS } from './types';

export function hasPermission(user: AuthUser | null | undefined, permission: Permission): boolean {
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN') return true;
  const permissions = user.permissions || ROLE_PERMISSIONS[user.role] || [];
  return permissions.includes(permission);
}

export function hasRole(user: AuthUser | null | undefined, role: UserRole): boolean {
  if (!user) return false;
  if (role === 'SALES_AGENT' && user.role === 'SALES_EXECUTIVE') return true;
  if (role === 'SALES_EXECUTIVE' && user.role === 'SALES_AGENT') return true;
  return user.role === role;
}

export function hasAnyRole(user: AuthUser | null | undefined, roles: UserRole[]): boolean {
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN') return true;
  return roles.some((r) => hasRole(user, r));
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
      return [
        'SUPER_ADMIN',
        'ADMIN',
        'VERIFICATION_OFFICER',
        'SALES_MANAGER',
        'SALES_AGENT',
        'SALES_EXECUTIVE',
        'MARKETING_MANAGER',
        'FINANCE',
      ].includes(user.role);
    case 'partner':
      return ['SUPER_ADMIN', 'CHANNEL_PARTNER', 'FRANCHISE'].includes(user.role);
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
    case 'VERIFICATION_OFFICER':
      return { label: 'ProVerify™ Officer', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    case 'SALES_MANAGER':
      return { label: 'Sales Manager', badgeClass: 'bg-purple-100 text-purple-800 border-purple-200' };
    case 'SALES_AGENT':
    case 'SALES_EXECUTIVE':
      return { label: 'Sales Agent', badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
    case 'DEVELOPER':
      return { label: 'Developer Rep', badgeClass: 'bg-teal-100 text-teal-800 border-teal-200' };
    case 'CHANNEL_PARTNER':
      return { label: 'Channel Partner', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'FRANCHISE':
      return { label: 'Franchise Partner', badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-200' };
    case 'MARKETING_MANAGER':
      return { label: 'Marketing Manager', badgeClass: 'bg-rose-100 text-rose-800 border-rose-200' };
    case 'FINANCE':
      return { label: 'Finance & Payouts', badgeClass: 'bg-violet-100 text-violet-800 border-violet-200' };
    case 'CUSTOMER':
      return { label: 'Verified Buyer', badgeClass: 'bg-neutral-100 text-neutral-800 border-neutral-200' };
  }
}
