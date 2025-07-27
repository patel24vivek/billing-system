import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, Calendar } from 'lucide-react';

const ReportsSection = ({ transactions }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const getFilteredTransactions = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    switch (selectedPeriod) {
      case 'today':
        return transactions.filter(t => new Date(t.timestamp) >= today);
      case 'week':
        return transactions.filter(t => new Date(t.timestamp) >= startOfWeek);
      case 'month':
        return transactions.filter(t => new Date(t.timestamp) >= startOfMonth);
      default:
        return transactions;
    }
  };

  const filteredTransactions = getFilteredTransactions();
  const totalSales = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = filteredTransactions.length;
  const averageOrderValue = totalTransactions > 0 ? totalSales / totalTransactions : 0;

  const paymentMethodStats = {
    cash: filteredTransactions.filter(t => t.paymentMethod === 'cash').reduce((sum, t) => sum + t.total, 0),
    card: filteredTransactions.filter(t => t.paymentMethod === 'card').reduce((sum, t) => sum + t.total, 0),
    upi: filteredTransactions.filter(t => t.paymentMethod === 'upi').reduce((sum, t) => sum + t.total, 0),
  };

  const productSales = filteredTransactions.reduce((acc, transaction) => {
    transaction.items.forEach(item => {
      if (acc[item.name]) {
        acc[item.name].quantity += item.quantity;
        acc[item.name].revenue += item.total;
      } else {
        acc[item.name] = {
          name: item.name,
          quantity: item.quantity,
          revenue: item.total
        };
      }
    });
    return acc;
  }, {});

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const dailySales = filteredTransactions.reduce((acc, transaction) => {
    const date = transaction.timestamp.toISOString().split('T')[0];
    if (acc[date]) {
      acc[date] += transaction.total;
    } else {
      acc[date] = transaction.total;
    }
    return acc;
  }, {});

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sales Reports</h2>
        <div className="flex space-x-2">
          {['today', 'week', 'month'].map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedPeriod === period ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Sales', value: `₹${totalSales.toFixed(2)}`, icon: <DollarSign className="w-6 h-6 text-green-600" />, bg: 'bg-green-100' },
          { label: 'Transactions', value: totalTransactions, icon: <ShoppingCart className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-100' },
          { label: 'Avg. Order Value', value: `₹${averageOrderValue.toFixed(2)}`, icon: <TrendingUp className="w-6 h-6 text-purple-600" />, bg: 'bg-purple-100' },
          { label: "Today's Date", value: new Date().toLocaleDateString(), icon: <Calendar className="w-6 h-6 text-orange-600" />, bg: 'bg-orange-100' }
        ].map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`${card.bg} p-3 rounded-full`}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Method Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" /> Payment Methods
          </h3>
          <div className="space-y-4">
            {['cash', 'card', 'upi'].map(method => (
              <div key={method} className="flex justify-between items-center">
                <span className="text-gray-600">{method.charAt(0).toUpperCase() + method.slice(1)}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        method === 'cash'
                          ? 'bg-green-600'
                          : method === 'card'
                          ? 'bg-blue-600'
                          : 'bg-purple-600'
                      }`}
                      style={{
                        width: `${totalSales > 0 ? (paymentMethodStats[method] / totalSales) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                  <span className="font-semibold">₹{paymentMethodStats[method].toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="text-gray-800">{product.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">₹{product.revenue.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">{product.quantity} sold</div>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && (
              <p className="text-gray-500 text-center py-4">No sales data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Daily Sales */}
      {Object.keys(dailySales).length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Sales</h3>
          <div className="space-y-3">
            {Object.entries(dailySales)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([date, sales]) => (
                <div key={date} className="flex justify-between items-center">
                  <span className="text-gray-600">{new Date(date).toLocaleDateString()}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.max(
                            totalSales > 0
                              ? (sales / Math.max(...Object.values(dailySales))) * 100
                              : 0,
                            5
                          )}%`
                        }}
                      ></div>
                    </div>
                    <span className="font-semibold w-20 text-right">₹{sales.toFixed(2)}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsSection;
