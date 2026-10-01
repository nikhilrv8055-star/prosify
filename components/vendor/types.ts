export interface VendorPropertyItem {
  id: string;
  title: string;
  type: 'Apartment' | 'Penthouse' | 'Villa' | 'Commercial' | 'Plot';
  city: string;
  location: string;
  price: number;
  carpetArea: number;
  bhk: string;
  status: 'AVAILABLE' | 'UNDER_OFFER' | 'BOOKED' | 'SOLD';
  reraId?: string;
  views: number;
  inquiries: number;
  createdAt: string;
}

export interface VendorProjectItem {
  id: string;
  name: string;
  reraNumber: string;
  city: string;
  location: string;
  towers: number;
  totalUnits: number;
  availableUnits: number;
  status: 'READY_TO_MOVE' | 'UNDER_CONSTRUCTION' | 'NEW_LAUNCH';
  completionDate: string;
  priceRange: string;
}

export interface PropertyMessageItem {
  id: string;
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  propertyTitle: string;
  message: string;
  timestamp: string;
  status: 'NEW' | 'RESPONDED' | 'SITE_VISIT_REQUESTED';
}

export interface VendorAgentItem {
  id: string;
  name: string;
  agency: string;
  phone: string;
  email: string;
  reraNumber: string;
  dealsClosed: number;
  commissionRate: string;
  status: 'ACTIVE' | 'VERIFIED' | 'PENDING';
}

export interface SupportTicketItem {
  id: string;
  ticketNumber: string;
  subject: string;
  category: 'Listing Approval' | 'Payment & Payout' | 'API Sync' | 'Technical' | 'Legal & RERA';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  lastReply: string;
}

export interface PaymentLogItem {
  id: string;
  txnNumber: string;
  description: string;
  amount: number;
  paymentMethod: 'UPI' | 'NET_BANKING' | 'CREDIT_CARD' | 'NEFT';
  date: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  invoiceUrl: string;
}

export interface VendorPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  propertiesLimit: string;
  projectsLimit: string;
  leadQuota: string;
  badge: string;
  features: string[];
}
