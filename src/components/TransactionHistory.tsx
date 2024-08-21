// src/components/TransactionHistory.tsx

import React from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { formatCurrency } from '../utils/mockData';

interface Transaction {
  date: string;
  amount: number;
  category: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  return (
    <Box>
      <Heading size="md" mb={4}>Recent Transactions</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Category</Th>
            <Th isNumeric>Amount</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.slice(0, 10).map((transaction, index) => (
            <Tr key={index}>
              <Td>{transaction.date}</Td>
              <Td>{transaction.category}</Td>
              <Td isNumeric color={transaction.amount < 0 ? 'red.500' : 'green.500'}>
                {formatCurrency(transaction.amount)}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TransactionHistory;
