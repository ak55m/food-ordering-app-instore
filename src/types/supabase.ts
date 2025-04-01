
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'customer' | 'restaurant_owner'
          restaurant_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'customer' | 'restaurant_owner'
          restaurant_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'customer' | 'restaurant_owner'
          restaurant_id?: string | null
          created_at?: string
        }
      }
      restaurants: {
        Row: {
          id: string
          name: string
          description: string
          image: string
          categories: string[] | null
          rating: number
          address: string
          latitude: number
          longitude: number
          phone: string
          email: string
          logo: string
          cover_image: string
          is_open: boolean
          is_new: boolean
          is_active: boolean
          accepts_online_orders: boolean
          created_at: string
          owner_id: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          image: string
          categories?: string[] | null
          rating?: number
          address: string
          latitude: number
          longitude: number
          phone: string
          email: string
          logo: string
          cover_image: string
          is_open?: boolean
          is_new?: boolean
          is_active?: boolean
          accepts_online_orders?: boolean
          created_at?: string
          owner_id: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image?: string
          categories?: string[] | null
          rating?: number
          address?: string
          latitude?: number
          longitude?: number
          phone?: string
          email?: string
          logo?: string
          cover_image?: string
          is_open?: boolean
          is_new?: boolean
          is_active?: boolean
          accepts_online_orders?: boolean
          created_at?: string
          owner_id?: string
        }
      }
      restaurant_opening_hours: {
        Row: {
          id: string
          restaurant_id: string
          day: string
          is_open: boolean
          open_time: string
          close_time: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          day: string
          is_open: boolean
          open_time: string
          close_time: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          day?: string
          is_open?: boolean
          open_time?: string
          close_time?: string
        }
      }
      restaurant_social_media: {
        Row: {
          id: string
          restaurant_id: string
          platform: string
          url: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          platform: string
          url: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          platform?: string
          url?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          restaurant_id: string
        }
        Insert: {
          id?: string
          name: string
          restaurant_id: string
        }
        Update: {
          id?: string
          name?: string
          restaurant_id?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          image: string
          category_id: string
          restaurant_id: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          image: string
          category_id: string
          restaurant_id: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          image?: string
          category_id?: string
          restaurant_id?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string
          status: string
          timestamp: string
          total: number
          payment_method: string
          payment_status: string
          payment_method_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_id: string
          status: string
          timestamp?: string
          total: number
          payment_method: string
          payment_status: string
          payment_method_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          restaurant_id?: string
          status?: string
          timestamp?: string
          total?: number
          payment_method?: string
          payment_status?: string
          payment_method_id?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          menu_item_id: string
          quantity: number
          price: number
        }
        Insert: {
          id?: string
          order_id: string
          menu_item_id: string
          quantity: number
          price: number
        }
        Update: {
          id?: string
          order_id?: string
          menu_item_id?: string
          quantity?: number
          price?: number
        }
      }
      payment_methods: {
        Row: {
          id: string
          user_id: string
          type: string
          last_four: string
          expiry_date: string | null
          cardholder_name: string | null
          is_default: boolean
          brand: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          last_four: string
          expiry_date?: string | null
          cardholder_name?: string | null
          is_default?: boolean
          brand?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          last_four?: string
          expiry_date?: string | null
          cardholder_name?: string | null
          is_default?: boolean
          brand?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
