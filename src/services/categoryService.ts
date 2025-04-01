
import { supabase } from '@/lib/supabase';
import { Category } from '@/types';
import { toast } from 'sonner';

export async function getCategories(restaurantId: string) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('restaurant_id', restaurantId);
      
    if (error) {
      return [];
    }
    
    return data.map(cat => ({
      id: cat.id,
      name: cat.name,
      restaurantId: cat.restaurant_id
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function createCategory(category: Omit<Category, 'id'>) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: category.name,
        restaurant_id: category.restaurantId
      })
      .select()
      .single();
      
    if (error) {
      toast.error('Failed to add category');
      return null;
    }
    
    toast.success('Category added successfully');
    return {
      id: data.id,
      name: data.name,
      restaurantId: data.restaurant_id
    };
  } catch (error) {
    console.error('Error creating category:', error);
    toast.error('Failed to add category');
    return null;
  }
}

export async function updateCategory(category: Category) {
  try {
    const { error } = await supabase
      .from('categories')
      .update({
        name: category.name
      })
      .eq('id', category.id);
      
    if (error) {
      toast.error('Failed to update category');
      return null;
    }
    
    toast.success('Category updated successfully');
    return category;
  } catch (error) {
    console.error('Error updating category:', error);
    toast.error('Failed to update category');
    return null;
  }
}

export async function deleteCategory(id: string) {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
      
    if (error) {
      toast.error('Failed to delete category');
      return false;
    }
    
    toast.success('Category deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    toast.error('Failed to delete category');
    return false;
  }
}
