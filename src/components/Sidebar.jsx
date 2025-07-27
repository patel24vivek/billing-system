import React from 'react';
import { 
  ShoppingCart, 
  Package, 
  Receipt, 
  BarChart3, 
  Settings,
  Store
} from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'billing', label: 'Billing', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="bg-white h-screen w-64 shadow-lg border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">vivek patel</h1>
            <p className="text-sm text-gray-500">Billing System</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors duration-200 ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
