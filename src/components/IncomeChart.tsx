// src/components/IncomeChart.tsx

import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/mockData';

interface IncomeChartProps {
  data: { date: string; amount: number }[];
  totalIncome: number;
}

const IncomeChart: React.FC<IncomeChartProps> = ({ data, totalIncome }) => {
  const averageIncome = totalIncome / data.length;

  return (
    <Box>
      <Heading size="md" mb={4}>Income Overview</Heading>
      <Text mb={2}>Total Income: {formatCurrency(totalIncome)}</Text>
      <Text mb={4}>Average Income: {formatCurrency(averageIncome)}</Text>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#4BC0C0" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default IncomeChart;
