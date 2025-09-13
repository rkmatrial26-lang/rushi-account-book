
import React from 'react';

interface SummaryCardProps {
  type: 'income' | 'expense';
  amount: number;
  formatter: (value: number) => string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ type, amount, formatter }) => {
  const isIncome = type === 'income';
  const colorClass = isIncome ? 'text-green-500' : 'text-red-500';
  const icon = isIncome ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
    </svg>
  );

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center space-x-3">
      <div className={`p-2 rounded-full ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
        <div className={colorClass}>{icon}</div>
      </div>
      <div>
        <p className="text-gray-500 capitalize">{type}</p>
        <p className={`font-bold text-lg ${colorClass}`}>{formatter(amount)}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
