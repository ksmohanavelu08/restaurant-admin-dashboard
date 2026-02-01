const Order = require('../models/Order');
const Joi = require('joi');

// Validation schema
const orderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        menuItem: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        price: Joi.number().min(0).required(),
      })
    )
    .min(1)
    .required(),
  totalAmount: Joi.number().min(0).required(),
  customerName: Joi.string().required().trim(),
  tableNumber: Joi.number().min(1),
  status: Joi.string().valid('Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'),
});

// @desc    Get all orders with pagination and filtering
// @route   GET /api/orders
// @access  Public
const getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const orders = await Order.find(filter)
      .populate('items.menuItem')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Public
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.menuItem');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = orderSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const order = await Order.create(value);
    const populatedOrder = await Order.findById(order._id).populate('items.menuItem');

    res.status(201).json({ success: true, data: populatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const validStatuses = ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('items.menuItem');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get top selling items (Analytics)
// @route   GET /api/analytics/top-sellers
// @access  Public
const getTopSellers = async (req, res) => {
  try {
    const topSellers = await Order.aggregate([
      // Unwind items array to create separate documents for each item
      { $unwind: '$items' },
      
      // Group by menu item and sum quantities
      {
        $group: {
          _id: '$items.menuItem',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
        },
      },
      
      // Lookup menu item details
      {
        $lookup: {
          from: 'menuitems',
          localField: '_id',
          foreignField: '_id',
          as: 'menuItemDetails',
        },
      },
      
      // Unwind the lookup result
      { $unwind: '$menuItemDetails' },
      
      // Sort by total quantity
      { $sort: { totalQuantity: -1 } },
      
      // Limit to top 5
      { $limit: 5 },
      
      // Project final shape
      {
        $project: {
          _id: 0,
          menuItemId: '$_id',
          name: '$menuItemDetails.name',
          category: '$menuItemDetails.category',
          totalQuantity: 1,
          totalRevenue: 1,
        },
      },
    ]);

    res.json({ success: true, data: topSellers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  getTopSellers,
};
