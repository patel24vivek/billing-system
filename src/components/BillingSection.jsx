import React, { useState } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Calculator,
  CreditCard,
  Smartphone,
  DollarSign
} from 'lucide-react';

const BillingSection = ({ products, onAddTransaction, onUpdateStock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

  const TAX_RATE = 0.05;

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode?.includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(
          cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
              : item
          )
        );
      }
    } else {
      if (product.stock > 0) {
        setCart([...cart, { ...product, quantity: 1, total: product.price }]);
      }
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      setCart(cart.filter((item) => item.id !== productId));
    } else {
      const product = products.find((p) => p.id === productId);
      if (product && newQuantity <= product.stock) {
        setCart(
          cart.map((item) =>
            item.id === productId
              ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
              : item
          )
        );
      }
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const processPayment = () => {
    if (cart.length === 0) return;

    const transaction = {
      id: Date.now().toString(),
      items: [...cart],
      subtotal,
      tax,
      total,
      paymentMethod,
      timestamp: new Date(),
      customerName: customerName || undefined
    };

    cart.forEach((item) => {
      const product = products.find((p) => p.id === item.id);
      if (product) {
        onUpdateStock(item.id, product.stock - item.quantity);
      }
    });

    onAddTransaction(transaction);
    setLastTransaction(transaction);
    setCart([]);
    setCustomerName('');
    setShowReceipt(true);
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="flex h-full">
      {/* Product Search */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Products</h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, barcode, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white p-4 rounded-lg shadow border border-gray-200 cursor-pointer hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {product.barcode && <p>Code: {product.barcode}</p>}
                <p>Stock: {product.stock} {product.unit}</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                <span className="text-sm text-gray-500">per {product.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing Section */}
      <div className="w-96 bg-gray-50 p-6 border-l border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Current Bill</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Customer name (optional)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4 space-y-2 max-h-64 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800">{item.name}</h4>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="font-semibold">₹{item.total}</span>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <>
            <div className="border-t border-gray-300 pt-4 mb-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax (5%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {['cash', 'card', 'upi'].map((method) => {
                  const Icon = method === 'cash' ? DollarSign : method === 'card' ? CreditCard : Smartphone;
                  return (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3 rounded-lg flex flex-col items-center space-y-1 ${
                        paymentMethod === method ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{method.charAt(0).toUpperCase() + method.slice(1)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={processPayment}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Process Payment</span>
            </button>
          </>
        )}
      </div>

      {/* Receipt */}
      {showReceipt && lastTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">Payment Successful!</h3>
              <p className="text-gray-600">Transaction completed</p>
            </div>

            <div className="border border-gray-300 p-4 rounded-lg mb-4 text-sm receipt-content">
              <div className="text-center mb-4">
                <h4 className="font-bold text-lg">vivek patel</h4>
                <p>Receipt #{lastTransaction.id}</p>
                <p>{lastTransaction.timestamp.toLocaleString()}</p>
                {lastTransaction.customerName && <p>Customer: {lastTransaction.customerName}</p>}
              </div>

              <div className="border-t border-gray-300 pt-2 mb-2">
                {lastTransaction.items.map((item) => (
                  <div key={item.id} className="flex justify-between mb-1">
                    <span>{item.name} x{item.quantity}</span>
                    <span>₹{item.total}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{lastTransaction.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{lastTransaction.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>₹{lastTransaction.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Payment:</span>
                  <span className="capitalize">{lastTransaction.paymentMethod}</span>
                </div>
              </div>

              <div className="text-center mt-4 text-xs text-gray-500">
                <p>Thank you for shopping with us!</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button onClick={printReceipt} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Print Receipt
              </button>
              <button
                onClick={() => setShowReceipt(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingSection;
            