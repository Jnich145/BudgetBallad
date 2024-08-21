// src/utils/mockData.ts

interface Transaction {
    date: string;
    amount: number;
    category: string;
  }
  
  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Rent', 'Shopping', 'Healthcare', 'Education'];
  
  export const generateMockData = (): Transaction[] => {
    const data: Transaction[] = [];
    const startDate = new Date(2024, 0, 1); // Start from January 1, 2024
    
    for (let i = 0; i < 90; i++) { // Generate 90 days of data
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const numberOfTransactions = Math.floor(Math.random() * 3) + 1; // 1 to 3 transactions per day
      
      for (let j = 0; j < numberOfTransactions; j++) {
        const amount = Math.random() * 200 - 100; // Random amount between -100 and 100
        data.push({
          date: date.toISOString().split('T')[0], // Format: YYYY-MM-DD
          amount: parseFloat(amount.toFixed(2)),
          category: categories[Math.floor(Math.random() * categories.length)]
        });
      }
    }
    
    return data;
  };
  
  export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  export const calculatePercentageChange = (oldValue: number, newValue: number): string => {
    const change = ((newValue - oldValue) / oldValue) * 100;
    return change.toFixed(1) + '%';
  };
  
  export const groupTransactionsByCategory = (transactions: Transaction[]): Record<string, number> => {
    return transactions.reduce((acc, transaction) => {
      const { category, amount } = transaction;
      acc[category] = (acc[category] || 0) + Math.abs(amount);
      return acc;
    }, {} as Record<string, number>);
  };
  
  export const getTopExpenses = (transactions: Transaction[], limit: number = 5): Transaction[] => {
    return transactions
      .filter(t => t.amount < 0)
      .sort((a, b) => a.amount - b.amount)
      .slice(0, limit)
      .map(e => ({ ...e, amount: Math.abs(e.amount) }));
  };
