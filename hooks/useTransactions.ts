
import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Transaction } from '../types';

const initialTransactions: Transaction[] = [
    { id: '1', description: 'Salary', amount: 50000, type: 'income', date: new Date(new Date().setDate(new Date().getDate() - 2)) },
    { id: '2', description: 'Rent', amount: 15000, type: 'expense', date: new Date(new Date().setDate(new Date().getDate() - 1)) },
    { id: '3', description: 'Groceries', amount: 3500, type: 'expense', date: new Date() },
    { id: '4', description: 'Freelance Project', amount: 8000, type: 'income', date: new Date() },
];

export const useTransactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>(() => {
        try {
            const localData = localStorage.getItem('transactions');
            if (localData) {
                const parsedData = JSON.parse(localData) as any[];
                return parsedData.map(t => ({...t, date: new Date(t.date)}));
            }
        } catch (error) {
            console.error("Failed to parse transactions from localStorage", error);
        }
        return initialTransactions;
    });

    useEffect(() => {
        try {
            localStorage.setItem('transactions', JSON.stringify(transactions));
        } catch (error) {
            console.error("Failed to save transactions to localStorage", error);
        }
    }, [transactions]);

    const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'date'>) => {
        const newTransaction: Transaction = {
            ...transaction,
            id: new Date().getTime().toString(),
            date: new Date(),
        };
        setTransactions(prev => [newTransaction, ...prev]);
    }, []);
    
    const deleteTransaction = useCallback((id: string) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    }, []);

    const editTransaction = useCallback((updatedTransaction: Transaction) => {
        setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    }, []);

    const { totalIncome, totalExpense, balance } = useMemo(() => {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const expense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        return { totalIncome: income, totalExpense: expense, balance: income - expense };
    }, [transactions]);

    const uniqueDescriptions = useMemo(() => {
        const descriptions = new Set(transactions.map(t => t.description));
        return Array.from(descriptions);
    }, [transactions]);

    return { transactions, addTransaction, deleteTransaction, editTransaction, totalIncome, totalExpense, balance, uniqueDescriptions };
};
