import React, { useState, useMemo } from 'react';
import type { Transaction } from '../types';
import TransactionItem from '../components/TransactionItem';

interface SearchScreenProps {
  isVisible: boolean;
  onClose: () => void;
  transactions: Transaction[];
  onEditTransaction: (transaction: Transaction) => void;
}

const SearchScreen: React.FC<SearchScreenProps> = ({
  isVisible,
  onClose,
  transactions,
  onEditTransaction
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const termMatch = searchTerm.trim() === '' || tx.description.toLowerCase().includes(searchTerm.toLowerCase());
      const dateMatch = searchDate === '' || new Date(tx.date).toISOString().slice(0, 10) === searchDate;
      return termMatch && dateMatch;
    });
  }, [transactions, searchTerm, searchDate]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(value);
  };
  
  return (
    <div className={`absolute inset-0 bg-gray-100 flex flex-col transition-transform duration-300 ease-in-out z-20 ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
      <header className="p-4 flex justify-between items-center bg-gray-100 sticky top-0">
        <h1 className="text-2xl font-bold text-gray-800">Search Transactions</h1>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div className="p-4 space-y-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by description..."
          className="w-full p-4 bg-white rounded-2xl shadow-sm text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="w-full p-4 bg-white rounded-2xl shadow-sm text-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <main className="flex-1 overflow-y-auto px-4 pb-4">
        {filteredTransactions.length > 0 ? (
          <div className="space-y-3">
            {filteredTransactions.map(tx => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                onRequestDelete={() => {}} // No delete from search screen
                onEdit={onEditTransaction}
                isSwiped={false}
                onSwipe={() => {}}
                formatter={formatCurrency}
                disableSwipe={true} // Disable swipe on search results for simplicity
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No transactions found.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchScreen;