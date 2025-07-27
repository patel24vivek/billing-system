import React, { useState } from 'react';
import { Receipt, Calendar, Filter, Search } from 'lucide-react';

const TransactionsSection = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.includes(searchTerm);
    const matchesPayment = selectedPaymentMethod === 'all' || transaction.paymentMethod === selectedPaymentMethod;
    const matchesDate = !selectedDate || 
                       transaction.timestamp.toISOString().split('T')[0] === selectedDate;
    
    return matchesSearch && matchesPayment && matchesDate;
  });

  const totalSales = filteredTransactions.reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>
        <div className="text-lg font-semibold text-green-600">
          Total Sales: ₹{totalSales.toFixed(2)}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Payment Methods</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
            </select>
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <Receipt className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-mono text-gray-900">#{transaction.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>{transaction.timestamp.toLocaleDateString()}</div>
                      <div className="text-gray-500">{transaction.timestamp.toLocaleTimeString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.customerName || 'Walk-in Customer'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {transaction.items.length} item{transaction.items.length !== 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-gray-500">
                      {transaction.items.slice(0, 2).map(item => item.name).join(', ')}
                      {transaction.items.length > 2 && ` +${transaction.items.length - 2} more`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                      transaction.paymentMethod === 'cash' ? 'bg-green-100 text-green-800' :
                      transaction.paymentMethod === 'card' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {transaction.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ₹{transaction.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No transactions found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsSection;
