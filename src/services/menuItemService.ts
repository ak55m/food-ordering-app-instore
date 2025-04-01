
import { supabase } from '@/lib/supabase';
import { MenuItem } from '@/types';
import { toast } from 'sonner';

export async function getMenuItems(categoryId: string) {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category_id', categoryId);
      
    if (error) {
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      categoryId: item.category_id,
      restaurantId: item.restaurant_id
    }));
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
}

export async function createMenuItem(menuItem: Omit<MenuItem, 'id'>) {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .insert({
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price,
        image: menuItem.image,
        category_id: menuItem.categoryId,
        restaurant_id: menuItem.restaurantId
      })
      .select()
      .single();
      
    if (error) {
      toast.error('Failed to add menu item');
      return null;
    }
    
    toast.success('Menu item added successfully');
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      image: data.image,
      categoryId: data.category_id,
      restaurantId: data.restaurant_id
    };
  } catch (error) {
    console.error('Error creating menu item:', error);
    toast.error('Failed to add menu item');
    return null;
  }
}

export async function updateMenuItem(menuItem: MenuItem) {
  try {
    const { error } = await supabase
      .from('menu_items')
      .update({
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price,
        image: menuItem.image,
        category_id: menuItem.categoryId
      })
      .eq('id', menuItem.id);
      
    if (error) {
      toast.error('Failed to update menu item');
      return null;
    }
    
    toast.success('Menu item updated successfully');
    return menuItem;
  } catch (error) {
    console.error('Error updating menu item:', error);
    toast.error('Failed to update menu item');
    return null;
  }
}

export async function deleteMenuItem(id: string) {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
      
    if (error) {
      toast.error('Failed to delete menu item');
      return false;
    }
    
    toast.success('Menu item deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    toast.error('Failed to delete menu item');
    return false;
  }
}
