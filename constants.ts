
import { MenuItem } from './types.ts';

// Standardized international format for WhatsApp links
export const MERCHANT_PHONE = "919259853515"; 
export const MERCHANT_UPI = "7983073238@ptyes";
export const PLATFORM_FEE = 5;

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Gourmet Burger',
    price: 99,
    description: 'Juicy artisan patty with melted cheddar, caramelised onions, and our secret dash sauce.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    name: 'Premium Pizza',
    price: 249,
    description: 'Hand-stretched dough topped with buffalo mozzarella, fresh basil, and sun-ripened tomatoes.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    name: 'Crispy Patties',
    price: 45,
    description: 'Golden flaky layers filled with savory spiced potato and pea medley.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    name: 'Celebration Cake',
    price: 450,
    description: 'Decadent multi-layered chocolate truffle cake, perfect for life\'s big moments.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    name: 'Velvet Pastry',
    price: 60,
    description: 'Signature Red Velvet sponge with silky smooth cream cheese frosting.',
    image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&q=80&w=800'
  }
];
