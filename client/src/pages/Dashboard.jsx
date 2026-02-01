import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { analyticsAPI, menuAPI, orderAPI } from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMenuItems: 0,
    availableItems: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });
  const [topSellers, setTopSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch stats
      const [menuResponse, ordersResponse, topSellersResponse] = await Promise.all([
        menuAPI.getAll(),
        orderAPI.getAll({ limit: 100 }),
        analyticsAPI.getTopSellers(),
      ]);

      const menuItems = menuResponse.data.data || [];
      const orders = ordersResponse.data.data || [];

      setStats({
        totalMenuItems: menuItems.length,
        availableItems: menuItems.filter((item) => item.isAvailable).length,
        totalOrders: ordersResponse.data.total || 0,
        pendingOrders: orders.filter((order) => order.status === 'Pending').length,
      });

      setTopSellers(topSellersResponse.data.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Menu Items',
      value: stats.totalMenuItems,
      icon: UtensilsCrossed,
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
    },
    {
      title: 'Available Items',
      value: stats.availableItems,
      icon: TrendingUp,
      color: 'bg-green-500',
      textColor: 'text-green-500',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'bg-purple-500',
      textColor: 'text-purple-500',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: DollarSign,
      color: 'bg-orange-500',
      textColor: 'text-orange-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your restaurant admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Sellers */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Top 5 Selling Items</h2>
        {topSellers.length > 0 ? (
          <div className="space-y-3">
            {topSellers.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 rounded-full font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{item.totalQuantity} sold</p>
                  <p className="text-sm text-green-600">${item.totalRevenue.toFixed(2)} revenue</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No sales data available yet</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/menu"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <UtensilsCrossed className="w-5 h-5" />
            <span>Manage Menu</span>
          </a>
          <a
            href="/orders"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>View Orders</span>
          </a>
          <button
            onClick={fetchDashboardData}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
