import React, { useState, useEffect, useMemo } from 'react';
import type { Transaction } from '../types';
import { CATEGORIES } from '../constants';

interface NewTransactionScreenProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id' | 'date'>, id?: string) => void;
  existingTransaction: Transaction | null;
  uniqueDescriptions: string[];
}

const NewTransactionScreen: React.FC<NewTransactionScreenProps> = ({
  isVisible,
  onClose,
  onSave,
  existingTransaction,
  uniqueDescriptions
}) => {
  const [amountStr, setAmountStr] = useState('0');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (existingTransaction) {
      setAmountStr(existingTransaction.amount.toString());
      setDescription(existingTransaction.description);
      setType(existingTransaction.type);
      setCategory(existingTransaction.category || '');
    } else {
      // Reset form when opening for a new transaction
      setAmountStr('0');
      setDescription('');
      setType('expense');
      setCategory('');
    }
  }, [existingTransaction, isVisible]);
  
  const handleNumberPadClick = (value: string) => {
    if (value === 'del') {
      setAmountStr(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
      return;
    }
    if (value === '.' && amountStr.includes('.')) return;

    setAmountStr(prev => {
      if (prev === '0' && value !== '.') return value;
      return prev + value;
    });
  };

  const handleSave = () => {
    const amount = parseFloat(amountStr);
    if (amount > 0 && description.trim() !== '') {
      onSave({ description, amount, type, category }, existingTransaction?.id);
    }
  };

  const suggestions = useMemo(() => {
    if (!description) return [];
    const lowerCaseDesc = description.toLowerCase();
    return uniqueDescriptions.filter(d => d.toLowerCase().includes(lowerCaseDesc) && d.toLowerCase() !== lowerCaseDesc);
  }, [description, uniqueDescriptions]);

  return (
    <div className={`absolute inset-0 bg-gray-100 flex flex-col transition-transform duration-300 ease-in-out z-20 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
      <header className="p-4 flex justify-between items-center bg-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">{existingTransaction ? 'Edit Transaction' : 'New Transaction'}</h1>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div className="flex-1 p-4 space-y-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
          <span className="text-gray-500 text-lg">₹</span>
          <span className="text-5xl font-extrabold text-gray-800 tracking-tighter">{amountStr}</span>
        </div>

        <div className="relative">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Description (e.g., Rent, Food, Salary)"
            className="w-full p-4 bg-white rounded-2xl shadow-sm text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showSuggestions && suggestions.length > 0 && (
             <div className="absolute w-full bg-white mt-1 rounded-lg shadow-lg z-10 max-h-32 overflow-y-auto">
              {suggestions.map(s => (
                <div key={s} onMouseDown={() => setDescription(s)} className="p-2 hover:bg-gray-100 cursor-pointer text-gray-800">{s}</div>
              ))}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setType('income')} className={`p-4 rounded-2xl text-lg font-bold transition-all ${type === 'income' ? 'bg-green-500 text-white shadow-lg' : 'bg-white text-gray-700'}`}>Income</button>
          <button onClick={() => setType('expense')} className={`p-4 rounded-2xl text-lg font-bold transition-all ${type === 'expense' ? 'bg-red-500 text-white shadow-lg' : 'bg-white text-gray-700'}`}>Expense</button>
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setDescription(cat)} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-300">{cat}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 p-2 bg-gray-200">
        {['1','2','3','4','5','6','7','8','9','.','0','del'].map(key => (
          <button key={key} onClick={() => handleNumberPadClick(key)} className="py-4 bg-white rounded-xl text-2xl font-semibold text-gray-800 active:bg-gray-100 shadow-sm">
            {key === 'del' ? 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 002.828 0L21 12M3 12l6.414-6.414a2 2 0 012.828 0L21 12" />
              </svg> 
              : key
            }
          </button>
        ))}
      </div>

      <button onClick={handleSave} className="w-full bg-blue-600 text-white p-5 text-xl font-bold hover:bg-blue-700 transition-colors">
        Save Transaction
      </button>
    </div>
  );
};

export default NewTransactionScreen;