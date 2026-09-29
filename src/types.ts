export interface Product {
  id: string;
  title: string;
  thumbnail: string;
  images: string[];
  price: number;
  old_price?: number;
  discount?: number;
  category: string;
  short_description?: string;
  full_description?: string;
  order_url: string;
  status: 'Active' | 'Inactive';
  created_at?: number;
  updated_at?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface StoreSettings {
  site_name: string;
  site_tagline: string;
  currency: string;
  hero_title: string;
  hero_subtitle: string;
  contact_email: string;
  order_policy: string;
}

export interface MenuItem {
  id: string;
  title: string;
  url: string;
  target?: '_self' | '_blank';
  order?: number;
  status: 'Active' | 'Inactive';
}
