import React from 'react';
import { Clock, User, Hash } from 'lucide-react';

const OrderRow = ({ order, onStatusUpdate }) => {
  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    Preparing: 'bg-blue-100 text-blue-700 border-blue-300',
    Ready: 'bg-green-100 text-green-700 border-green-300',
    Delivered: 'bg-gray-100 text-gray-700 border-gray-300',
    Cancelled: 'bg-red-100 text-red-700 border-red-300',
  };

  const handleStatusChange = (e) => {
    onStatusUpdate(order._id, e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex flex-wrap justify-between items-start mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Hash className="w-4 h-4 text-gray-400" />
          <span className="font-mono text-sm text-gray-600">{order.orderNumber}</span>
        </div>
        <select
          value={order.status}
          onChange={handleStatusChange}
          className={`px-3 py-1 rounded-full text-sm font-medium border ${
            statusColors[order.status]
          } focus:outline-none focus:ring-2 focus:ring-primary-500`}
        >
          <option value="Pending">Pending</option>
          <option value="Preparing">Preparing</option>
          <option value="Ready">Ready</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700">{order.customerName}</span>
        </div>
        {order.tableNumber && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Table:</span>
            <span className="text-sm font-medium text-gray-700">{order.tableNumber}</span>
          </div>
        )}
      </div>

      <div className="border-t pt-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Items:</h4>
        <div className="space-y-1">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.quantity}x {item.menuItem?.name || 'Unknown Item'}
              </span>
              <span className="text-gray-700 font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-3 pt-3 border-t">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{new Date(order.createdAt).toLocaleString()}</span>
        </div>
        <div className="text-lg font-bold text-primary-600">
          ${order.totalAmount.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default OrderRow;
