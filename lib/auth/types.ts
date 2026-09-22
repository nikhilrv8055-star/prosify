export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'SALES_MANAGER'
  | 'SALES_EXECUTIVE'
  | 'DEVELOPER'
  | 'CHANNEL_PARTNER'
  | 'CUSTOMER';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  partnerCode?: string; // For CHANNEL_PARTNER
  developerId?: string; // For DEVELOPER
  permissions: string[];
}

export type Permission =
  | 'properties:read'
  | 'properties:write'
  | 'projects:read'
  | 'projects:write'
  | 'inventory:manage'
  | 'leads:read_all'
  | 'leads:read_assigned'
  | 'leads:write'
  | 'site_visits:manage'
  | 'commissions:manage'
  | 'commissions:view_own'
  | 'channel_partners:manage'
  | 'analytics:view_all'
  | 'analytics:view_own'
  | 'users:manage'
  | 'audit_logs:read'
  | 'portal:admin_access'
  | 'portal:partner_access'
  | 'portal:developer_access';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    'properties:read',
    'properties:write',
    'projects:read',
    'projects:write',
    'inventory:manage',
    'leads:read_all',
    'leads:read_assigned',
    'leads:write',
    'site_visits:manage',
    'commissions:manage',
    'commissions:view_own',
    'channel_partners:manage',
    'analytics:view_all',
    'analytics:view_own',
    'users:manage',
    'audit_logs:read',
    'portal:admin_access',
    'portal:partner_access',
    'portal:developer_access',
  ],
  ADMIN: [
    'properties:read',
    'properties:write',
    'projects:read',
    'projects:write',
    'inventory:manage',
    'leads:read_all',
    'leads:read_assigned',
    'leads:write',
    'site_visits:manage',
    'commissions:manage',
    'commissions:view_own',
    'channel_partners:manage',
    'analytics:view_all',
    'portal:admin_access',
    'portal:partner_access',
    'portal:developer_access',
  ],
  SALES_MANAGER: [
    'properties:read',
    'projects:read',
    'leads:read_all',
    'leads:write',
    'site_visits:manage',
    'analytics:view_all',
    'portal:admin_access',
  ],
  SALES_EXECUTIVE: [
    'properties:read',
    'projects:read',
    'leads:read_assigned',
    'leads:write',
    'site_visits:manage',
    'portal:admin_access',
  ],
  DEVELOPER: [
    'properties:read',
    'properties:write',
    'projects:read',
    'projects:write',
    'inventory:manage',
    'analytics:view_own',
    'portal:developer_access',
  ],
  CHANNEL_PARTNER: [
    'properties:read',
    'projects:read',
    'leads:write',
    'commissions:view_own',
    'analytics:view_own',
    'portal:partner_access',
  ],
  CUSTOMER: [
    'properties:read',
    'projects:read',
    'leads:write',
  ],
};

export const DEMO_USERS: Record<UserRole, AuthUser> = {
  SUPER_ADMIN: {
    id: 'user_super_admin',
    name: 'Vikramaditya Singhania',
    email: 'admin@prosify.local',
    phone: '+91 98200 11223',
    role: 'SUPER_ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    permissions: ROLE_PERMISSIONS.SUPER_ADMIN,
  },
  ADMIN: {
    id: 'user_ops_admin',
    name: 'Ananya Deshmukh',
    email: 'operations@prosify.in',
    phone: '+91 98200 44556',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    permissions: ROLE_PERMISSIONS.ADMIN,
  },
  SALES_MANAGER: {
    id: 'user_sales_mgr',
    name: 'Rohit Kulkarni',
    email: 'rohit.k@prosify.in',
    phone: '+91 98200 77889',
    role: 'SALES_MANAGER',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    permissions: ROLE_PERMISSIONS.SALES_MANAGER,
  },
  SALES_EXECUTIVE: {
    id: 'user_sales_exec',
    name: 'Priya Sharma',
    email: 'priya.s@prosify.in',
    phone: '+91 98200 99001',
    role: 'SALES_EXECUTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    permissions: ROLE_PERMISSIONS.SALES_EXECUTIVE,
  },
  DEVELOPER: {
    id: 'user_lodha_rep',
    name: 'Rajesh Mehta (Lodha Group)',
    email: 'dev@lodhagroup.in',
    phone: '+91 98200 33445',
    role: 'DEVELOPER',
    developerId: 'dev_lodha',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    permissions: ROLE_PERMISSIONS.DEVELOPER,
  },
  CHANNEL_PARTNER: {
    id: 'user_cp_realtors',
    name: 'Nikhil Rane (Apex Capital Realtors)',
    email: 'nikhil@apexrealtors.in',
    phone: '+91 93263 03244',
    role: 'CHANNEL_PARTNER',
    partnerCode: 'APEX2026',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    permissions: ROLE_PERMISSIONS.CHANNEL_PARTNER,
  },
  CUSTOMER: {
    id: 'user_buyer_1',
    name: 'Dr. Sameer Joshi',
    email: 'sameer.joshi@gmail.com',
    phone: '+91 98190 55443',
    role: 'CUSTOMER',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    permissions: ROLE_PERMISSIONS.CUSTOMER,
  },
};
