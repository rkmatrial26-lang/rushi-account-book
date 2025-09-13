
import React, { useState, useCallback } from 'react';
import HomeScreen from './screens/HomeScreen';
import NewTransactionScreen from './screens/NewTransactionScreen';
import SearchScreen from './screens/SearchScreen';
import { useTransactions } from './hooks/useTransactions';
import type { Screen, Transaction } from './types';

const App: React.FC = () => {
  const { 
    transactions, 
    addTransaction, 
    deleteTransaction, 
    editTransaction, 
    totalIncome, 
    totalExpense, 
    balance, 
    uniqueDescriptions 
  } = useTransactions();

  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

  const navigate = (screen: Screen) => setCurrentScreen(screen);

  const handleEditRequest = useCallback((transaction: Transaction) => {
    setTransactionToEdit(transaction);
    navigate('new');
  }, []);

  const handleSaveTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'date'>, id?: string) => {
    if (id) {
      editTransaction({ ...transaction, id, date: transactionToEdit?.date || new Date() });
    } else {
      addTransaction(transaction);
    }
    setTransactionToEdit(null);
    navigate('home');
  }, [addTransaction, editTransaction, transactionToEdit]);

  const handleCloseForm = () => {
    setTransactionToEdit(null);
    navigate('home');
  };

  return (
    <div className="relative h-[100svh] w-full max-w-md mx-auto bg-gray-100 overflow-hidden shadow-2xl">
      <HomeScreen
        transactions={transactions}
        balance={balance}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        onAddTransaction={() => navigate('new')}
        onSearch={() => navigate('search')}
        onDeleteTransaction={deleteTransaction}
        onEditTransaction={handleEditRequest}
        isVisible={currentScreen === 'home'}
      />
      <NewTransactionScreen
        isVisible={currentScreen === 'new'}
        onClose={handleCloseForm}
        onSave={handleSaveTransaction}
        existingTransaction={transactionToEdit}
        uniqueDescriptions={uniqueDescriptions}
      />
      <SearchScreen
        isVisible={currentScreen === 'search'}
        onClose={() => navigate('home')}
        transactions={transactions}
        onEditTransaction={handleEditRequest}
      />
    </div>
  );
};

export default App;
