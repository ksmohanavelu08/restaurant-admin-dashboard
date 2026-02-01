const MenuItem = require('../models/MenuItem');
const Joi = require('joi');

// Validation schema
const menuItemSchema = Joi.object({
  name: Joi.string().required().trim(),
  description: Joi.string().allow('').trim(),
  category: Joi.string()
    .valid('Appetizer', 'Main Course', 'Dessert', 'Beverage')
    .required(),
  price: Joi.number().min(0).required(),
  ingredients: Joi.array().items(Joi.string()),
  isAvailable: Joi.boolean(),
  preparationTime: Joi.number().min(0),
  imageUrl: Joi.string().uri().allow(''),
});

// @desc    Get all menu items with filters
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res) => {
  try {
    const { category, availability, minPrice, maxPrice } = req.query;
    
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (availability !== undefined) {
      filter.isAvailable = availability === 'true';
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const menuItems = await MenuItem.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: menuItems.length, data: menuItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search menu items
// @route   GET /api/menu/search
// @access  Public
const searchMenuItems = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    // Use text search or regex
    const menuItems = await MenuItem.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { ingredients: { $in: [new RegExp(q, 'i')] } },
        { description: { $regex: q, $options: 'i' } },
      ],
    });

    res.json({ success: true, count: menuItems.length, data: menuItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
const getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    res.json({ success: true, data: menuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create menu item
// @route   POST /api/menu
// @access  Private
const createMenuItem = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = menuItemSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const menuItem = await MenuItem.create(value);
    res.status(201).json({ success: true, data: menuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private
const updateMenuItem = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = menuItemSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    res.json({ success: true, data: menuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    res.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle menu item availability
// @route   PATCH /api/menu/:id/availability
// @access  Private
const toggleAvailability = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    res.json({ success: true, data: menuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMenuItems,
  searchMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
};
