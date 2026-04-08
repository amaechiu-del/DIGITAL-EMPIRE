export type ProductCategory = "courses" | "training" | "software" | "digital-products";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  image: string;
  features: string[];
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  downloadUrl?: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "completed" | "failed";
  paymentReference: string;
  createdAt: string;
}
