export interface Customer {
  id: number;
  name: string;
  created_at: string;
  email: string;
  phone: string;
  phone_numbers?: Array<{phone: string}>;
  address?: string;
  role?: number;
  reason?: string;
  status?: number;
}
