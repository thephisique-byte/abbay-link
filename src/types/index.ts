export type UserRole = 'buyer' | 'supplier' | 'broker' | 'admin';

export interface User {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  role: UserRole;
  country: string;
  city?: string;
  avatar?: string;
}

export type RequestStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Finding Suppliers'
  | 'Supplier Matched'
  | 'Quotation Requested'
  | 'Quotation Received'
  | 'Buyer Review'
  | 'Connected'
  | 'Completed'
  | 'Closed';

export type SupplierVerificationStatus =
  | 'Supplier Information'
  | 'Contacted'
  | 'Under Review'
  | 'Verified';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'match' | 'quote' | 'status' | 'connection' | 'message';
  requestId?: string;
  read: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
}

export interface SourcingRequest {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  buyerPhone: string;
  buyerEmail: string;
  title: string;
  category: string;
  quantity: number;
  unit: string;
  specifications: string;
  destinationCountry: string;
  destinationCity: string;
  preferredOrigin: string; // e.g. "Australia", "China", "Turkey", "India", "UAE", "Europe", "No preference"
  budget?: string;
  currency?: string;
  additionalRequirements?: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  matchedSupplierIds: string[];
  quotationIds: string[];
  brokerNotes?: string;
  brokerFee?: {
    type: 'Percentage' | 'Fixed' | 'Negotiated';
    value: number | string;
    currency: string;
  };
  activityTimeline: Array<{
    id: string;
    title: string;
    timestamp: string;
    note?: string;
    status?: RequestStatus;
  }>;
}

export interface Supplier {
  id: string;
  name: string;
  country: string;
  flag: string;
  website: string;
  contactPerson: string;
  email: string;
  phone: string;
  categories: string[];
  products: string[];
  exportMarkets: string[];
  moq: string;
  description: string;
  status: SupplierVerificationStatus;
  yearEstablished?: number;
  certifications?: string[];
}

export interface Quotation {
  id: string;
  requestId: string;
  supplierId: string;
  supplierName: string;
  supplierCountry: string;
  product: string;
  unitPrice: number;
  currency: string;
  moq: string;
  leadTime: string;
  incoterm: string; // e.g. "FOB", "CIF Djibouti", "EXW", "CFR"
  packaging: string;
  shippingEstimate: string;
  validUntil: string;
  notes: string;
  createdAt: string;
}

export interface Connection {
  id: string;
  requestId: string;
  requestTitle: string;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  supplierId: string;
  supplierName: string;
  supplierCountry: string;
  status: 'Connection Requested' | 'Introduction Facilitated' | 'In Commercial Discussion' | 'Completed';
  createdAt: string;
  notes?: string;
}

export interface Message {
  id: string;
  requestId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  timestamp: string;
  isInternal?: boolean;
}

export interface ProductReference {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  origin: string;
  manufacturer: string;
  specs: Record<string, string>;
  shortSpec?: string;
  image: string;
  description: string;
  typicalMOQ: string;
  estimatedPrice?: string;
  supplierAvailability?: string;
  applications?: string[];
  documents?: string[];
}
