
import { Restaurant, MenuItem, Category } from '@/types';

// Mock Restaurant Data
export const mockRestaurants: Restaurant[] = [
  {
    id: 'rest1',
    name: 'Burger Palace',
    description: 'Best burgers in town with a variety of sides and drinks.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop',
    categories: ['Burgers', 'American', 'Fast Food'],
    rating: 4.5,
    address: '123 Main St, Anytown, USA',
    coordinates: {
      latitude: 40.712776,
      longitude: -74.005974
    },
    isOpen: true
  },
  {
    id: 'rest2',
    name: 'Pizza Haven',
    description: 'Authentic Italian pizzas made with fresh ingredients.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=300&fit=crop',
    categories: ['Pizza', 'Italian'],
    rating: 4.7,
    address: '456 Pine St, Anytown, USA',
    coordinates: {
      latitude: 40.714976,
      longitude: -74.007004
    },
    isOpen: true
  },
  {
    id: 'rest3',
    name: 'Sushi Delight',
    description: 'Fresh and delicious sushi and Japanese cuisine.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&h=300&fit=crop',
    categories: ['Sushi', 'Japanese'],
    rating: 4.8,
    address: '789 Oak St, Anytown, USA',
    coordinates: {
      latitude: 40.709676,
      longitude: -74.000974
    },
    isOpen: true
  },
  {
    id: 'rest4',
    name: 'Taco Fiesta',
    description: 'Authentic Mexican street food and refreshing drinks.',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=300&fit=crop',
    categories: ['Mexican', 'Tacos'],
    rating: 4.3,
    address: '101 Elm St, Anytown, USA',
    coordinates: {
      latitude: 40.718276,
      longitude: -74.012974
    },
    isOpen: true
  }
];

// Mock Categories
export const mockCategories: Category[] = [
  { id: 'cat1', name: 'Burgers', restaurantId: 'rest1' },
  { id: 'cat2', name: 'Sides', restaurantId: 'rest1' },
  { id: 'cat3', name: 'Drinks', restaurantId: 'rest1' },
  { id: 'cat4', name: 'Classic Pizzas', restaurantId: 'rest2' },
  { id: 'cat5', name: 'Specialty Pizzas', restaurantId: 'rest2' },
  { id: 'cat6', name: 'Drinks & Desserts', restaurantId: 'rest2' },
  { id: 'cat7', name: 'Sushi Rolls', restaurantId: 'rest3' },
  { id: 'cat8', name: 'Sashimi', restaurantId: 'rest3' },
  { id: 'cat9', name: 'Tacos', restaurantId: 'rest4' },
  { id: 'cat10', name: 'Burritos', restaurantId: 'rest4' }
];

// Mock Menu Items
export const mockMenuItems: MenuItem[] = [
  // Burger Palace
  {
    id: 'item1',
    name: 'Classic Burger',
    description: 'Beef patty with lettuce, tomato, and special sauce',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop',
    categoryId: 'cat1',
    restaurantId: 'rest1'
  },
  {
    id: 'item2',
    name: 'Cheese Burger',
    description: 'Classic burger with American cheese',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=500&h=300&fit=crop',
    categoryId: 'cat1',
    restaurantId: 'rest1'
  },
  {
    id: 'item3',
    name: 'French Fries',
    description: 'Crispy golden fries with sea salt',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1576777647209-e8733d7b851d?w=500&h=300&fit=crop',
    categoryId: 'cat2',
    restaurantId: 'rest1'
  },
  
  // Pizza Haven
  {
    id: 'item4',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=300&fit=crop',
    categoryId: 'cat4',
    restaurantId: 'rest2'
  },
  {
    id: 'item5',
    name: 'Pepperoni Pizza',
    description: 'Margherita with pepperoni slices',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&h=300&fit=crop',
    categoryId: 'cat4',
    restaurantId: 'rest2'
  },
  
  // Sushi Delight
  {
    id: 'item6',
    name: 'California Roll',
    description: 'Crab, avocado, and cucumber roll',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&h=300&fit=crop',
    categoryId: 'cat7',
    restaurantId: 'rest3'
  },
  {
    id: 'item7',
    name: 'Salmon Sashimi',
    description: 'Fresh salmon slices (5 pcs)',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&h=300&fit=crop',
    categoryId: 'cat8',
    restaurantId: 'rest3'
  },
  
  // Taco Fiesta
  {
    id: 'item8',
    name: 'Beef Taco',
    description: 'Seasoned ground beef with lettuce, cheese, and salsa',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=300&fit=crop',
    categoryId: 'cat9',
    restaurantId: 'rest4'
  },
  {
    id: 'item9',
    name: 'Chicken Burrito',
    description: 'Grilled chicken with rice, beans, and cheese',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1566740933229-e3c656571c47?w=500&h=300&fit=crop',
    categoryId: 'cat10',
    restaurantId: 'rest4'
  }
];
