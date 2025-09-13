import React, { useRef } from 'react';
import type { Transaction } from '../types';

interface TransactionItemProps {
  transaction: Transaction;
  onRequestDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
  isSwiped: boolean;
  onSwipe: (id: string | null) => void;
  formatter: (value: number) => string;
  disableSwipe?: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onRequestDelete,
  onEdit,
  isSwiped,
  onSwipe,
  formatter,
  disableSwipe = false
}) => {
  const swipeRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disableSwipe) return;
    startX.current = e.clientX;
    currentX.current = 0;
    if (swipeRef.current) {
        swipeRef.current.style.transition = 'none';
    }
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = (e: PointerEvent) => {
    const deltaX = e.clientX - startX.current;
    currentX.current = deltaX;
    if (swipeRef.current) {
      if (deltaX < 0) { // only allow left swipe
        swipeRef.current.style.transform = `translateX(${Math.max(deltaX, -160)}px)`;
      } else if (deltaX > 0) { // allow right swipe to close
        swipeRef.current.style.transform = `translateX(${Math.min(deltaX, 0)}px)`;
      }
    }
  };

  const handlePointerUp = () => {
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);

    if (swipeRef.current) {
      swipeRef.current.style.transition = 'transform 0.3s ease';
      if (currentX.current < -80) { // threshold to snap open
        swipeRef.current.style.transform = 'translateX(-160px)';
        onSwipe(transaction.id);
      } else {
        swipeRef.current.style.transform = 'translateX(0px)';
        if(isSwiped) onSwipe(null);
      }
    }
  };

  React.useEffect(() => {
    if (!isSwiped && swipeRef.current) {
        swipeRef.current.style.transform = 'translateX(0px)';
        swipeRef.current.style.transition = 'transform 0.3s ease';
    }
  }, [isSwiped]);
  
  const handleEdit = () => {
    onEdit(transaction);
    onSwipe(null);
  };
  
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? 'text-green-500' : 'text-red-500';
  const amountSign = isIncome ? '+' : '';

  return (
    <div className="relative bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="absolute top-0 right-0 h-full flex z-0">
        <button onClick={handleEdit} className="bg-blue-500 text-white w-20 flex items-center justify-center font-semibold">
          Edit
        </button>
        <button onClick={() => onRequestDelete(transaction.id)} className="bg-red-500 text-white w-20 flex items-center justify-center font-semibold">
          Delete
        </button>
      </div>
      <div
        ref={swipeRef}
        onPointerDown={handlePointerDown}
        className="relative bg-white p-4 flex justify-between items-center touch-pan-y z-10 cursor-grab"
      >
        <div className="flex-1">
          <p className="font-bold text-gray-800 capitalize">{transaction.description}</p>
          <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
        </div>
        <div className={`font-bold text-lg ${amountColor}`}>
          {`${amountSign}${formatter(transaction.amount)}`}
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;