
export interface UserInfo {
  name: string;
  phone: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface LocationData {
  latitude: number | null;
  longitude: number | null;
  status: 'pending' | 'connected' | 'denied' | 'manual';
  address?: string;
}

export enum View {
  LOGIN = 'LOGIN',
  LOCATION = 'LOCATION',
  HOME = 'HOME',
  DETAIL = 'DETAIL',
  CHECKOUT = 'CHECKOUT',
  SUCCESS = 'SUCCESS'
}

export enum PaymentMethod {
  UPI = 'UPI Online',
  COD = 'Cash on Delivery'
}
