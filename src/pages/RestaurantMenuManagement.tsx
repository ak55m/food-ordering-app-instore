import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext, Category, MenuItem as MenuItemType } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Image } from 'lucide-react';
import { toast } from "sonner";
import RestaurantSidebar from '@/components/RestaurantSidebar';

const RestaurantMenuManagement: React.FC = () => {
  const { 
    categories, 
    menuItems, 
    getRestaurantCategories, 
    getCategoryMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addCategory,
    updateCategory,
    deleteCategory 
  } = useAppContext();
  
  const navigate = useNavigate();
  const [restaurantId, setRestaurantId] = useState('1'); // Default to first restaurant
  const restaurantCategories = getRestaurantCategories(restaurantId);
  
  // State for category dialogs
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  
  // State for menu item dialogs
  const [isAddMenuItemOpen, setIsAddMenuItemOpen] = useState(false);
  const [isEditMenuItemOpen, setIsEditMenuItemOpen] = useState(false);
  const [currentMenuItem, setCurrentMenuItem] = useState<MenuItemType | null>(null);
  const [currentCategoryId, setCurrentCategoryId] = useState<string>("");
  const [menuItemForm, setMenuItemForm] = useState({
    name: "",
    description: "",
    price: "",
    image: ""
  });
  
  // Category handlers
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    
    addCategory({
      name: newCategoryName,
      restaurantId
    });
    
    setNewCategoryName("");
    setIsAddCategoryOpen(false);
    toast.success("Category added successfully!");
  };
  
  const handleEditCategory = () => {
    if (!currentCategory || !newCategoryName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    
    updateCategory({
      ...currentCategory,
      name: newCategoryName
    });
    
    setNewCategoryName("");
    setIsEditCategoryOpen(false);
    toast.success("Category updated successfully!");
  };
  
  const openEditCategory = (category: Category) => {
    setCurrentCategory(category);
    setNewCategoryName(category.name);
    setIsEditCategoryOpen(true);
  };
  
  const handleDeleteCategory = (categoryId: string) => {
    // Check if this category has menu items
    const items = getCategoryMenuItems(categoryId);
    if (items.length > 0) {
      toast.error("Cannot delete a category that contains menu items");
      return;
    }
    
    deleteCategory(categoryId);
    toast.success("Category deleted successfully!");
  };
  
  // Menu item handlers
  const handleAddMenuItem = () => {
    if (!menuItemForm.name.trim() || !currentCategoryId) {
      toast.error("Name and category are required");
      return;
    }
    
    const price = parseFloat(menuItemForm.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Price must be a positive number");
      return;
    }
    
    addMenuItem({
      id: Date.now().toString(), // Add the required id property
      name: menuItemForm.name,
      description: menuItemForm.description,
      price,
      image: menuItemForm.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=300&fit=crop",
      categoryId: currentCategoryId
    });
    
    setMenuItemForm({name: "", description: "", price: "", image: ""});
    setIsAddMenuItemOpen(false);
    toast.success("Menu item added successfully!");
  };
  
  const openAddMenuItem = (categoryId: string) => {
    setCurrentCategoryId(categoryId);
    setIsAddMenuItemOpen(true);
  };
  
  const openEditMenuItem = (item: MenuItemType) => {
    setCurrentMenuItem(item);
    setMenuItemForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      image: item.image
    });
    setIsEditMenuItemOpen(true);
  };
  
  const handleEditMenuItem = () => {
    if (!currentMenuItem || !menuItemForm.name.trim()) {
      toast.error("Name is required");
      return;
    }
    
    const price = parseFloat(menuItemForm.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Price must be a positive number");
      return;
    }
    
    updateMenuItem({
      ...currentMenuItem,
      name: menuItemForm.name,
      description: menuItemForm.description,
      price,
      image: menuItemForm.image || currentMenuItem.image
    });
    
    setMenuItemForm({name: "", description: "", price: "", image: ""});
    setIsEditMenuItemOpen(false);
    toast.success("Menu item updated successfully!");
  };
  
  const handleDeleteMenuItem = (itemId: string) => {
    deleteMenuItem(itemId);
    toast.success("Menu item deleted successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden md:block md:w-64">
        <RestaurantSidebar activePage="menu" />
      </div>
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Menu Management</h1>
            <Button 
              className="bg-brand-cyan hover:bg-cyan-600"
              onClick={() => setIsAddCategoryOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Category
            </Button>
          </div>
          
          {restaurantCategories.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="mb-4">
                <Plus className="h-12 w-12 mx-auto text-gray-400" />
              </div>
              <h2 className="text-lg font-semibold mb-2">No Menu Categories</h2>
              <p className="text-gray-500 mb-4">Start by creating a category for your menu items</p>
              <Button 
                className="bg-brand-cyan hover:bg-cyan-600"
                onClick={() => setIsAddCategoryOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" /> Add First Category
              </Button>
            </div>
          ) : (
            <Tabs 
              defaultValue={restaurantCategories[0]?.id} 
              className="w-full"
            >
              <div className="flex justify-between items-center mb-4 overflow-x-auto">
                <TabsList className="flex-1">
                  {restaurantCategories.map(category => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="flex-1"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {restaurantCategories.map(category => {
                const categoryItems = getCategoryMenuItems(category.id);
                return (
                  <TabsContent key={category.id} value={category.id}>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">{category.name}</h2>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openEditCategory(category)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit Category
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-500 hover:text-red-500"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-brand-cyan hover:bg-cyan-600"
                          onClick={() => openAddMenuItem(category.id)}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add Item
                        </Button>
                      </div>
                    </div>
                    
                    {categoryItems.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 mb-4">No menu items in this category</p>
                        <Button 
                          size="sm"
                          className="bg-brand-cyan hover:bg-cyan-600"
                          onClick={() => openAddMenuItem(category.id)}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add First Item
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {categoryItems.map(item => (
                          <Card key={item.id}>
                            <CardContent className="p-4 flex">
                              <div className="w-24 h-24 rounded-md overflow-hidden mr-4 flex-shrink-0">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                  <h3 className="font-medium">{item.name}</h3>
                                  <span className="font-semibold">${item.price.toFixed(2)}</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                                <div className="flex gap-2 mt-3">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => openEditMenuItem(item)}
                                  >
                                    <Edit className="h-3 w-3 mr-1" /> Edit
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-red-500 hover:text-red-500"
                                    onClick={() => handleDeleteMenuItem(item.id)}
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          )}
        </div>
      </main>
      
      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input 
                id="categoryName" 
                placeholder="e.g. Appetizers, Main Course, Desserts" 
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>Cancel</Button>
            <Button className="bg-brand-cyan hover:bg-cyan-600" onClick={handleAddCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editCategoryName">Category Name</Label>
              <Input 
                id="editCategoryName" 
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryOpen(false)}>Cancel</Button>
            <Button className="bg-brand-cyan hover:bg-cyan-600" onClick={handleEditCategory}>Update Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Menu Item Dialog */}
      <Dialog open={isAddMenuItemOpen} onOpenChange={setIsAddMenuItemOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Menu Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name</Label>
              <Input 
                id="itemName" 
                placeholder="e.g. Classic Burger" 
                value={menuItemForm.name}
                onChange={(e) => setMenuItemForm({...menuItemForm, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemDescription">Description</Label>
              <Textarea 
                id="itemDescription" 
                placeholder="Describe your menu item..." 
                value={menuItemForm.description}
                onChange={(e) => setMenuItemForm({...menuItemForm, description: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemPrice">Price ($)</Label>
              <Input 
                id="itemPrice" 
                type="number" 
                min="0.01" 
                step="0.01" 
                placeholder="9.99" 
                value={menuItemForm.price}
                onChange={(e) => setMenuItemForm({...menuItemForm, price: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemImage">Image URL</Label>
              <div className="flex gap-2">
                <Input 
                  id="itemImage" 
                  placeholder="https://example.com/image.jpg" 
                  value={menuItemForm.image}
                  onChange={(e) => setMenuItemForm({...menuItemForm, image: e.target.value})}
                  className="flex-1"
                />
                <Button variant="outline" className="flex-shrink-0">
                  <Image className="h-4 w-4 mr-2" /> Browse
                </Button>
              </div>
              <p className="text-xs text-gray-500">Leave blank for a default image</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMenuItemOpen(false)}>Cancel</Button>
            <Button className="bg-brand-cyan hover:bg-cyan-600" onClick={handleAddMenuItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Menu Item Dialog */}
      <Dialog open={isEditMenuItemOpen} onOpenChange={setIsEditMenuItemOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editItemName">Item Name</Label>
              <Input 
                id="editItemName" 
                value={menuItemForm.name}
                onChange={(e) => setMenuItemForm({...menuItemForm, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editItemDescription">Description</Label>
              <Textarea 
                id="editItemDescription" 
                value={menuItemForm.description}
                onChange={(e) => setMenuItemForm({...menuItemForm, description: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editItemPrice">Price ($)</Label>
              <Input 
                id="editItemPrice" 
                type="number" 
                min="0.01" 
                step="0.01" 
                value={menuItemForm.price}
                onChange={(e) => setMenuItemForm({...menuItemForm, price: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editItemImage">Image URL</Label>
              <div className="flex gap-2">
                <Input 
                  id="editItemImage" 
                  value={menuItemForm.image}
                  onChange={(e) => setMenuItemForm({...menuItemForm, image: e.target.value})}
                  className="flex-1"
                />
                <Button variant="outline" className="flex-shrink-0">
                  <Image className="h-4 w-4 mr-2" /> Browse
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditMenuItemOpen(false)}>Cancel</Button>
            <Button className="bg-brand-cyan hover:bg-cyan-600" onClick={handleEditMenuItem}>Update Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RestaurantMenuManagement;
