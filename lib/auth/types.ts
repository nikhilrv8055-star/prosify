export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'SALES_MANAGER'
  | 'SALES_AGENT'
  | 'SALES_EXECUTIVE' // backward compatibility alias for SALES_AGENT
  | 'DEVELOPER'
  | 'CHANNEL_PARTNER'
  | 'FRANCHISE'
  | 'VERIFICATION_OFFICER'
  | 'MARKETING_MANAGER'
  | 'FINANCE'
  | 'CUSTOMER';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  partnerCode?: string; // For CHANNEL_PARTNER
  franchiseCode?: string; // For FRANCHISE
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
  | 'portal:developer_access'
  // Extended operating system permissions
  | 'verification:review'
  | 'verification:approve'
  | 'crm:sync'
  | 'ai:audit_read'
  | 'finance:manage';

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
    'verification:review',
    'verification:approve',
    'crm:sync',
    'ai:audit_read',
    'finance:manage',
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
    'verification:review',
    'verification:approve',
    'crm:sync',
    'ai:audit_read',
  ],
  VERIFICATION_OFFICER: [
    'properties:read',
    'projects:read',
    'projects:write',
    'inventory:manage',
    'portal:admin_access',
    'verification:review',
    'verification:approve',
    'audit_logs:read',
    'ai:audit_read',
  ],
  SALES_MANAGER: [
    'properties:read',
    'projects:read',
    'leads:read_all',
    'leads:write',
    'site_visits:manage',
    'analytics:view_all',
    'portal:admin_access',
    'crm:sync',
  ],
  SALES_AGENT: [
    'properties:read',
    'projects:read',
    'leads:read_assigned',
    'leads:write',
    'site_visits:manage',
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
  FRANCHISE: [
    'properties:read',
    'projects:read',
    'leads:read_assigned',
    'leads:write',
    'commissions:view_own',
    'analytics:view_own',
    'portal:partner_access',
  ],
  MARKETING_MANAGER: [
    'properties:read',
    'projects:read',
    'leads:read_all',
    'analytics:view_all',
    'portal:admin_access',
    'crm:sync',
  ],
  FINANCE: [
    'properties:read',
    'commissions:manage',
    'commissions:view_own',
    'analytics:view_all',
    'finance:manage',
    'portal:admin_access',
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
    email: 'admin@prosify.in',
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
  VERIFICATION_OFFICER: {
    id: 'user_verif_officer',
    name: 'Adv. Aniket Vartak',
    email: 'aniket.vartak@prosify.in',
    phone: '+91 98200 88990',
    role: 'VERIFICATION_OFFICER',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    permissions: ROLE_PERMISSIONS.VERIFICATION_OFFICER,
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
  SALES_AGENT: {
    id: 'user_sales_agent',
    name: 'Priya Sharma',
    email: 'priya.s@prosify.in',
    phone: '+91 98200 99001',
    role: 'SALES_AGENT',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    permissions: ROLE_PERMISSIONS.SALES_AGENT,
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
    phone: '+91 91679 91679',
    role: 'CHANNEL_PARTNER',
    partnerCode: 'APEX2026',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    permissions: ROLE_PERMISSIONS.CHANNEL_PARTNER,
  },
  FRANCHISE: {
    id: 'user_franchise_thane',
    name: 'Suresh Patil (Prosify Thane Central)',
    email: 'thane.branch@prosify.in',
    phone: '+91 98200 66554',
    role: 'FRANCHISE',
    franchiseCode: 'FR-THANE-01',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    permissions: ROLE_PERMISSIONS.FRANCHISE,
  },
  MARKETING_MANAGER: {
    id: 'user_marketing_lead',
    name: 'Tanvi Shah',
    email: 'marketing@prosify.in',
    phone: '+91 98200 55443',
    role: 'MARKETING_MANAGER',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    permissions: ROLE_PERMISSIONS.MARKETING_MANAGER,
  },
  FINANCE: {
    id: 'user_finance_mgr',
    name: 'Kavita Menon',
    email: 'finance@prosify.in',
    phone: '+91 98200 22334',
    role: 'FINANCE',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    permissions: ROLE_PERMISSIONS.FINANCE,
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
