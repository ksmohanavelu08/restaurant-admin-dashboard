import React from 'react';
import { Edit, Trash2, Clock } from 'lucide-react';

const MenuCard = ({ item, onEdit, onDelete, onToggleAvailability }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-200">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              item.category === 'Appetizer'
                ? 'bg-blue-100 text-blue-700'
                : item.category === 'Main Course'
                ? 'bg-green-100 text-green-700'
                : item.category === 'Dessert'
                ? 'bg-pink-100 text-pink-700'
                : 'bg-purple-100 text-purple-700'
            }`}
          >
            {item.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
          <p className="text-lg font-bold text-primary-600">${item.price}</p>
        </div>

        {item.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
        )}

        {item.preparationTime && (
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <Clock className="w-4 h-4" />
            <span>{item.preparationTime} mins</span>
          </div>
        )}

        {item.ingredients && item.ingredients.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Ingredients:</p>
            <div className="flex flex-wrap gap-1">
              {item.ingredients.slice(0, 3).map((ingredient, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {ingredient}
                </span>
              ))}
              {item.ingredients.length > 3 && (
                <span className="px-2 py-1 text-gray-500 text-xs">
                  +{item.ingredients.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t">
          <button
            onClick={() => onToggleAvailability(item._id, item.isAvailable)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              item.isAvailable
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            {item.isAvailable ? 'Available' : 'Unavailable'}
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(item)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(item._id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
