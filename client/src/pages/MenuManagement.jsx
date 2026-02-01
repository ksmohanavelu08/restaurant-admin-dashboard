import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { menuAPI } from '../utils/api';
import { useDebounce } from '../hooks/useDebounce';
import MenuCard from '../components/MenuCard';
import MenuForm from '../components/MenuForm';
import Toast from '../components/Toast';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [previousMenuState, setPreviousMenuState] = useState([]);

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);

      let response;

      if (debouncedSearchQuery.trim()) {
        response = await menuAPI.search(debouncedSearchQuery);
      } else {
        const params = {};
        if (selectedCategory) params.category = selectedCategory;
        if (selectedAvailability) params.availability = selectedAvailability;

        response = await menuAPI.getAll(params);
      }

      setMenuItems(response.data.data || []);
    } catch (error) {
      showToast('Failed to fetch menu items', 'error');
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchQuery, selectedCategory, selectedAvailability]);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingItem) {
        await menuAPI.update(editingItem._id, formData);
        showToast('Menu item updated successfully', 'success');
      } else {
        await menuAPI.create(formData);
        showToast('Menu item created successfully', 'success');
      }

      setIsFormOpen(false);
      setEditingItem(null);
      fetchMenuItems();
    } catch (error) {
      showToast(error.response?.data?.message || 'Operation failed', 'error');
      console.error('Error saving menu item:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await menuAPI.delete(id);
      showToast('Menu item deleted successfully', 'success');
      fetchMenuItems();
    } catch (error) {
      showToast('Failed to delete menu item', 'error');
      console.error('Error deleting menu item:', error);
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    // Store previous state for potential rollback
    setPreviousMenuState([...menuItems]);

    // Optimistic UI update
    const updatedMenu = menuItems.map((item) =>
      item._id === id ? { ...item, isAvailable: !currentStatus } : item
    );
    setMenuItems(updatedMenu);

    try {
      await menuAPI.toggleAvailability(id);
      showToast('Availability updated successfully', 'success');
    } catch (error) {
      // Rollback on error
      setMenuItems(previousMenuState);
      showToast('Failed to update availability. Reverting changes...', 'error');
      console.error('Error toggling availability:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedAvailability('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600 mt-1">Manage your restaurant menu items</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Menu Item</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            {loading && debouncedSearchQuery && (
              <p className="text-sm text-gray-500 mt-1">Searching...</p>
            )}
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="Appetizer">Appetizer</option>
              <option value="Main Course">Main Course</option>
              <option value="Dessert">Dessert</option>
              <option value="Beverage">Beverage</option>
            </select>
          </div>

          <div className="flex gap-2">
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>

            {(searchQuery || selectedCategory || selectedAvailability) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Clear filters"
              >
                <Filter className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      {loading && !debouncedSearchQuery ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : menuItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">No menu items found</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            Add your first menu item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <MenuCard
              key={item._id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleAvailability={handleToggleAvailability}
            />
          ))}
        </div>
      )}

      {/* Menu Form Modal */}
      <MenuForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleCreateOrUpdate}
        initialData={editingItem}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default MenuManagement;

