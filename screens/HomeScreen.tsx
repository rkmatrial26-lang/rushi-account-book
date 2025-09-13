import React, { useState } from 'react';
import type { Transaction } from '../types';
import SummaryCard from '../components/SummaryCard';
import TransactionItem from '../components/TransactionItem';
import AnimatedNumber from '../components/AnimatedNumber';

interface HomeScreenProps {
  transactions: Transaction[];
  balance: number;
  totalIncome: number;
  totalExpense: number;
  onAddTransaction: () => void;
  onSearch: () => void;
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
  isVisible: boolean;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  transactions,
  balance,
  totalIncome,
  totalExpense,
  onAddTransaction,
  onSearch,
  onDeleteTransaction,
  onEditTransaction,
  isVisible
}) => {
  const [swipedItemId, setSwipedItemId] = useState<string | null>(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleRequestDelete = (id: string) => {
    setDeletingTransactionId(id);
  };

  const handleConfirmDelete = () => {
    if (deletingTransactionId) {
      onDeleteTransaction(deletingTransactionId);
      setDeletingTransactionId(null);
      setSwipedItemId(null); // Close the swiped item
    }
  };

  const handleCancelDelete = () => {
    setDeletingTransactionId(null);
  };
  
  return (
    <div className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}>
      <header className="bg-gray-100 p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800">Account Book</h1>
        <button onClick={onSearch} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-24">
        {/* Balance Card */}
        <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg mb-6">
          <p className="text-blue-200 text-lg">Total Balance</p>
          <div className="text-4xl font-extrabold tracking-tight">
             <AnimatedNumber value={balance} formatter={formatCurrency} />
          </div>
        </div>

        {/* Income & Expense Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <SummaryCard type="income" amount={totalIncome} formatter={formatCurrency} />
          <SummaryCard type="expense" amount={totalExpense} formatter={formatCurrency} />
        </div>

        {/* Recent Transactions */}
        <h2 className="text-xl font-bold text-gray-700 mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          {transactions.map(tx => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onRequestDelete={handleRequestDelete}
              onEdit={onEditTransaction}
              isSwiped={swipedItemId === tx.id}
              onSwipe={setSwipedItemId}
              formatter={formatCurrency}
            />
          ))}
        </div>
      </main>

      {/* Floating Add Button */}
      <button onClick={onAddTransaction} className="absolute bottom-6 right-6 bg-blue-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-700 transition-transform transform hover:scale-110 active:scale-100 z-20">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Deletion Confirmation Modal */}
      {deletingTransactionId && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Transaction</h3>
            <p className="mb-6 text-gray-600">Are you sure? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button onClick={handleCancelDelete} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors">No</button>
              <button onClick={handleConfirmDelete} className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;