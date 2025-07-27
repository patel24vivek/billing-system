import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BillingSection from './components/BillingSection';
import InventorySection from './components/InventorySection';
import TransactionsSection from './components/TransactionsSection';
import ReportsSection from './components/ReportsSection';
import SettingsSection from './components/SettingsSection';
import { initialProducts } from './data/products';

function App() {
  const [activeTab, setActiveTab] = useState('billing');
  const [products, setProducts] = useState(initialProducts);
  const [transactions, setTransactions] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('grocerypos-products');
    const savedTransactions = localStorage.getItem('grocerypos-transactions');
    
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    
    if (savedTransactions) {
      const parsedTransactions = JSON.parse(savedTransactions).map((t) => ({
        ...t,
        timestamp: new Date(t.timestamp)
      }));
      setTransactions(parsedTransactions);
    }
  }, []);

  // Save data to localStorage whenever products or transactions change
  useEffect(() => {
    localStorage.setItem('grocerypos-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('grocerypos-transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: Date.now().toString()
    };
    setProducts([...products, newProduct]);
  };

  const handleUpdateProduct = (id, productData) => {
    setProducts(products.map(p => p.id === id ? { ...productData, id } : p));
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleUpdateStock = (productId, newStock) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, stock: newStock } : p
    ));
  };

  const handleAddTransaction = (transaction) => {
    setTransactions([transaction, ...transactions]);
  };

  const handleUpdateSettings = (settings) => {
    localStorage.setItem('grocerypos-settings', JSON.stringify(settings));
  };

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'billing':
        return (
          <BillingSection
            products={products}
            onAddTransaction={handleAddTransaction}
            onUpdateStock={handleUpdateStock}
          />
        );
      case 'inventory':
        return (
          <InventorySection
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case 'transactions':
        return <TransactionsSection transactions={transactions} />;
      case 'reports':
        return <ReportsSection transactions={transactions} />;
      case 'settings':
        return <SettingsSection onUpdateSettings={handleUpdateSettings} />;
      default:
        return (
          <BillingSection
            products={products}
            onAddTransaction={handleAddTransaction}
            onUpdateStock={handleUpdateStock}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-hidden">
        {renderActiveSection()}
      </div>
    </div>
  );
}

export default App;
