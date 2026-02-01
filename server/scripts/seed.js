require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const sampleMenuItems = [
  {
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with classic Caesar dressing',
    category: 'Appetizer',
    price: 8.99,
    ingredients: ['romaine lettuce', 'parmesan', 'croutons', 'caesar dressing'],
    preparationTime: 10,
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1',
  },
  {
    name: 'Chicken Wings',
    description: 'Crispy wings with your choice of sauce',
    category: 'Appetizer',
    price: 12.99,
    ingredients: ['chicken wings', 'buffalo sauce', 'ranch dressing'],
    preparationTime: 20,
    imageUrl: 'https://images.unsplash.com/photo-1608039755401-742074f0548d',
  },
  {
    name: 'Mozzarella Sticks',
    description: 'Golden fried mozzarella with marinara sauce',
    category: 'Appetizer',
    price: 9.99,
    ingredients: ['mozzarella cheese', 'breadcrumbs', 'marinara sauce'],
    preparationTime: 15,
    imageUrl: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7',
  },
  {
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with lemon butter sauce',
    category: 'Main Course',
    price: 24.99,
    ingredients: ['salmon', 'lemon', 'butter', 'herbs'],
    preparationTime: 25,
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
  },
  {
    name: 'Ribeye Steak',
    description: '12oz premium ribeye cooked to perfection',
    category: 'Main Course',
    price: 32.99,
    ingredients: ['ribeye steak', 'garlic', 'rosemary', 'butter'],
    preparationTime: 30,
    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462',
  },
  {
    name: 'Chicken Parmesan',
    description: 'Breaded chicken breast with marinara and mozzarella',
    category: 'Main Course',
    price: 18.99,
    ingredients: ['chicken breast', 'marinara sauce', 'mozzarella', 'parmesan'],
    preparationTime: 25,
    imageUrl: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8',
  },
  {
    name: 'Vegetable Pasta',
    description: 'Penne pasta with seasonal vegetables',
    category: 'Main Course',
    price: 16.99,
    ingredients: ['penne pasta', 'zucchini', 'bell peppers', 'tomatoes', 'olive oil'],
    preparationTime: 20,
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9',
  },
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella and basil',
    category: 'Main Course',
    price: 14.99,
    ingredients: ['pizza dough', 'tomato sauce', 'mozzarella', 'basil'],
    preparationTime: 18,
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
  },
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center',
    category: 'Dessert',
    price: 8.99,
    ingredients: ['chocolate', 'eggs', 'flour', 'butter', 'vanilla ice cream'],
    preparationTime: 15,
    imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51',
  },
  {
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee and mascarpone',
    category: 'Dessert',
    price: 9.99,
    ingredients: ['ladyfingers', 'mascarpone', 'espresso', 'cocoa powder'],
    preparationTime: 10,
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9',
  },
  {
    name: 'Cheesecake',
    description: 'New York style cheesecake with berry compote',
    category: 'Dessert',
    price: 8.99,
    ingredients: ['cream cheese', 'graham crackers', 'berries', 'sugar'],
    preparationTime: 12,
    imageUrl: 'https://images.unsplash.com/photo-1533134242728-2941447084bf',
  },
  {
    name: 'Ice Cream Sundae',
    description: 'Three scoops with your choice of toppings',
    category: 'Dessert',
    price: 6.99,
    ingredients: ['vanilla ice cream', 'chocolate sauce', 'whipped cream', 'cherry'],
    preparationTime: 5,
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb',
  },
  {
    name: 'Fresh Lemonade',
    description: 'Homemade lemonade with fresh lemons',
    category: 'Beverage',
    price: 3.99,
    ingredients: ['lemon', 'sugar', 'water', 'ice'],
    preparationTime: 5,
    imageUrl: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9b',
  },
  {
    name: 'Iced Coffee',
    description: 'Cold brew coffee over ice',
    category: 'Beverage',
    price: 4.99,
    ingredients: ['coffee', 'ice', 'milk', 'sugar'],
    preparationTime: 3,
    imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
  },
  {
    name: 'Mango Smoothie',
    description: 'Tropical mango smoothie with yogurt',
    category: 'Beverage',
    price: 5.99,
    ingredients: ['mango', 'yogurt', 'honey', 'ice'],
    preparationTime: 5,
    imageUrl: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625',
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await MenuItem.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared existing data');

    // Insert menu items
    const menuItems = await MenuItem.insertMany(sampleMenuItems);
    console.log(`${menuItems.length} menu items created`);

    // Create sample orders
    const sampleOrders = [];
    const statuses = ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];
    const customerNames = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams', 'Charlie Brown'];

    for (let i = 0; i < 10; i++) {
      const randomItems = [];
      const numItems = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < numItems; j++) {
        const randomMenuItem = menuItems[Math.floor(Math.random() * menuItems.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        
        randomItems.push({
          menuItem: randomMenuItem._id,
          quantity,
          price: randomMenuItem.price,
        });
      }

      const totalAmount = randomItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      sampleOrders.push({
        orderNumber: `ORD-${Date.now()}-${i + 1}`,
        items: randomItems,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
        tableNumber: Math.floor(Math.random() * 20) + 1,
      });
    }

    await Order.insertMany(sampleOrders);
    console.log(`${sampleOrders.length} orders created`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
