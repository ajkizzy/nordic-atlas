export type UserRole = 'owner' | 'sales' | 'warehouse';
export type LeadCategory = 'restaurant' | 'market' | 'retail' | 'cafe' | 'other';
export type LeadStatus = 'new' | 'contacted' | 'negotiating' | 'won' | 'lost';
export type AssetKind = 'mockup' | 'contract' | 'document';
export type BagPotential = 'high' | 'medium' | 'low';
export type Cuisine =
  | 'burger' | 'bbq' | 'fastfood' | 'sushi' | 'asian'
  | 'indian' | 'middle_eastern' | 'pizza' | 'sandwich'
  | 'bakery' | 'deli' | 'salad' | 'cafe' | 'other';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Client {
  id: string;
  name: string;
  org_number: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  name: string;
  category: LeadCategory;
  cuisine: Cuisine;
  lat: number;
  lng: number;
  address: string | null;
  city: string | null;
  status: LeadStatus;
  color: string | null;
  client_id: string | null;
  source: 'manual' | 'cvr' | 'google_places' | 'wolt';
  assigned_to: string | null;
  notes: string | null;
  phone: string | null;
  email: string | null;
  external_ref: string | null;
  bag_potential: BagPotential;
  created_at: string;
  updated_at: string;
}

export interface ClientAsset {
  id: string;
  client_id: string;
  file_path: string;
  file_name: string;
  file_type: string | null;
  kind: AssetKind;
  uploaded_by: string | null;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string | null;
  stock_qty: number;
  unit: string;
  low_stock_threshold: number;
  unit_price: number;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: string;
  item_id: string;
  client_id: string | null;
  qty: number;
  unit_price_at_sale: number;
  total: number;
  sold_by: string | null;
  sold_at: string;
  note: string | null;
}

// Default status → colour mapping (user can override per-node via `color`)
export const STATUS_COLORS: Record<LeadStatus, string> = {
  new: '#64748b',
  contacted: '#f59e0b',
  negotiating: '#3b82f6',
  won: '#257244', // brand-500
  lost: '#e11d48',
};

export const CATEGORY_LABELS: Record<LeadCategory, string> = {
  restaurant: 'Restaurants',
  market: 'Markets',
  retail: 'Retail',
  cafe: 'Cafés',
  other: 'Other',
};

export const MODULE_ACCESS: Record<UserRole, { crm: boolean; inventory: boolean; admin: boolean }> = {
  owner: { crm: true, inventory: true, admin: true },
  sales: { crm: true, inventory: true, admin: false },
  warehouse: { crm: false, inventory: true, admin: false },
};

/** Takeaway-bag volume estimate — the primary sales prioritisation signal. */
export const BAG_POTENTIAL_META: Record<BagPotential, { label: string; color: string }> = {
  high: { label: 'High bag use', color: '#257244' },
  medium: { label: 'Medium', color: '#f59e0b' },
  low: { label: 'Low', color: '#94a3b8' },
};
