import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantSidebar from '@/components/RestaurantSidebar';
import { Category, MenuItem } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const RestaurantMenuManagement = () => {
  const navigate = useNavigate();
  const { 
    user,
    categories,
    getRestaurantCategories,
    getCategoryMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addCategory,
    updateCategory,
    deleteCategory
  } = useAppContext();

  // Local states
  const [restaurantId, setRestaurantId] = useState<string>('');
  const [restaurantCategories, setRestaurantCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [categoryItems, setCategoryItems] = useState<MenuItem[]>([]);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  
  // Form states
  const [categoryName, setCategoryName] = useState('');
  const [editedCategory, setEditedCategory] = useState<Category | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemImage, setItemImage] = useState('');
  const [editedItem, setEditedItem] = useState<MenuItem | null>(null);

  // Initialize data
  useEffect(() => {
    if (user && user.restaurantId) {
      setRestaurantId(user.restaurantId);
      const cats = getRestaurantCategories(user.restaurantId);
      setRestaurantCategories(cats);
      
      if (cats.length > 0) {
        setSelectedCategoryId(cats[0].id);
        setCategoryItems(getCategoryMenuItems(cats[0].id));
      }
    }
  }, [user, getRestaurantCategories, getCategoryMenuItems]);

  // Get items for the selected category
  useEffect(() => {
    if (selectedCategoryId) {
      setCategoryItems(getCategoryMenuItems(selectedCategoryId));
    }
  }, [selectedCategoryId, getCategoryMenuItems]);

  // Add category handler
  const handleAddCategory = () => {
    if (!categoryName.trim()) return;
    
    addCategory({
      name: categoryName,
      restaurantId
    });
    
    const updatedCategories = getRestaurantCategories(restaurantId);
    setRestaurantCategories(updatedCategories);
    setCategoryName('');
    setIsAddCategoryOpen(false);
  };

  // Edit category handler
  const handleEditCategory = () => {
    if (!editedCategory || !categoryName.trim()) return;
    
    updateCategory({
      ...editedCategory,
      name: categoryName
    });
    
    const updatedCategories = getRestaurantCategories(restaurantId);
    setRestaurantCategories(updatedCategories);
    setEditedCategory(null);
    setCategoryName('');
    setIsEditCategoryOpen(false);
  };

  // Delete category handler
  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(categoryId);
      
      const updatedCategories = getRestaurantCategories(restaurantId);
      setRestaurantCategories(updatedCategories);
      
      if (categoryId === selectedCategoryId) {
        setSelectedCategoryId(updatedCategories.length > 0 ? updatedCategories[0].id : '');
        setCategoryItems(updatedCategories.length > 0 ? getCategoryMenuItems(updatedCategories[0].id) : []);
      }
    }
  };

  // Add menu item handler
  const handleAddItem = () => {
    if (!itemName.trim() || !itemPrice.trim()) return;
    
    addMenuItem({
      name: itemName,
      description: itemDescription,
      price: parseFloat(itemPrice),
      image: itemImage || '/placeholder.svg',
      categoryId: selectedCategoryId,
    });
    
    setCategoryItems(getCategoryMenuItems(selectedCategoryId));
    resetItemForm();
    setIsAddItemOpen(false);
  };

  // Edit menu item handler
  const handleEditItem = () => {
    if (!editedItem || !itemName.trim() || !itemPrice.trim()) return;
    
    updateMenuItem({
      ...editedItem,
      name: itemName,
      description: itemDescription,
      price: parseFloat(itemPrice),
      image: itemImage || editedItem.image
    });
    
    setCategoryItems(getCategoryMenuItems(selectedCategoryId));
    resetItemForm();
    setIsEditItemOpen(false);
  };

  // Delete menu item handler
  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteMenuItem(itemId);
      
      setCategoryItems(getCategoryMenuItems(selectedCategoryId));
    }
  };

  // Reset item form
  const resetItemForm = () => {
    setItemName('');
    setItemDescription('');
    setItemPrice('');
    setItemImage('');
    setEditedItem(null);
  };

  return (
    <div className="flex h-screen bg-ebf7fd">
      {/* Sidebar */}
      <RestaurantSidebar activePage="menu" />

      {/* Content */}
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-semibold mb-4 text-cyan-500">Menu Management</h1>

        {/* Categories Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-gray-700">Categories</h2>
            <Button size="sm" onClick={() => setIsAddCategoryOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurantCategories.map((category) => (
              <Card key={category.id} className="shadow-md">
                <CardContent className="flex items-center justify-between p-3">
                  <span className="text-gray-800 font-medium">{category.name}</span>
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => {
                        setEditedCategory(category);
                        setCategoryName(category.name);
                        setIsEditCategoryOpen(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Menu Items Section */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-gray-700">Menu Items</h2>
            <Button size="sm" onClick={() => setIsAddItemOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
          <Separator className="mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryItems.map((item) => (
              <Card key={item.id} className="shadow-md">
                <CardContent className="p-4">
                  <div className="flex flex-col h-full">
                    <img 
                      src={item.image || '/placeholder.svg'} 
                      alt={item.name} 
                      className="w-full h-32 object-cover mb-2 rounded-md" 
                    />
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-brand-orange font-bold">${item.price.toFixed(2)}</span>
                      <div className="space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => {
                            setEditedItem(item);
                            setItemName(item.name);
                            setItemDescription(item.description);
                            setItemPrice(item.price.toString());
                            setItemImage(item.image);
                            setIsEditItemOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Add Category Modal */}
        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="categoryName" className="text-right">
                  Name
                </Label>
                <Input 
                  id="categoryName" 
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="col-span-3" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleAddCategory}>
                Add Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Category Modal */}
        <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="categoryName" className="text-right">
                  Name
                </Label>
                <Input 
                  id="categoryName" 
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="col-span-3" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleEditCategory}>
                Update Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Menu Item Modal */}
        <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Menu Item</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="itemName" className="text-right">
                  Name
                </Label>
                <Input 
                  id="itemName" 
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="itemDescription" className="text-right">
                  Description
                </Label>
                <Input 
                  id="itemDescription" 
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="itemPrice" className="text-right">
                  Price
                </Label>
                <Input 
                  id="itemPrice" 
                  type="number"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="itemImage" className="text-right">
                  Image URL
                </Label>
                <Input 
                  id="itemImage" 
                  value={itemImage}
                  onChange={(e) => setItemImage(e.target.value)}
                  className="col-span-3" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleAddItem}>
                Add Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Menu Item Modal */}
        <Dialog open={isEditItemOpen} onOpenChange={setIsEditItemOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Menu Item</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="itemName" className="text-right">
                  Name
                </Label>
                <Input 
                  id="itemName" 
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="itemDescription" className="text-right">
                  Description
                </Label>
                <Input 
                  id="itemDescription" 
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="itemPrice" className="text-right">
                  Price
                </Label>
                <Input 
                  id="itemPrice" 
                  type="number"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="itemImage" className="text-right">
                  Image URL
                </Label>
                <Input 
                  id="itemImage" 
                  value={itemImage}
                  onChange={(e) => setItemImage(e.target.value)}
                  className="col-span-3" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleEditItem}>
                Update Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default RestaurantMenuManagement;
