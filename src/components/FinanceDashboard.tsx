// src/components/FinanceDashboard.tsx

import React, { useState, useEffect } from 'react';
import {
  Box, Flex, Heading, Text, Button, Select, Tabs, TabList, TabPanels, Tab, TabPanel,
  Card, CardHeader, CardBody, Stat, StatLabel, StatNumber, StatHelpText, Grid, useColorModeValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { AlertCircle, Menu, X, DollarSign, TrendingUp, TrendingDown, PieChart as PieChartIcon } from 'lucide-react';
import { formatCurrency, calculatePercentageChange, groupTransactionsByCategory, getTopExpenses } from '../utils/mockData';
import ExpensesChart from './ExpensesChart';
import IncomeChart from './IncomeChart';
import TransactionHistory from './TransactionHistory';
import CsvUpload from './CsvUpload';

interface Transaction {
  date: string;
  description: string;
  amount: number;
  category: string;
}

const FinanceDashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState('1m');
  const [totalBalance, setTotalBalance] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  useEffect(() => {
    if (transactions.length > 0) {
      setTotalBalance(transactions.reduce((sum, transaction) => sum + transaction.amount, 0));
    }
  }, [transactions]);

  const handleDataUploaded = (data: Transaction[]) => {
    setTransactions(data);
  };

  const filterTransactions = (days: number) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return transactions.filter(t => new Date(t.date) >= cutoffDate);
  };

  const filteredTransactions = filterTransactions(selectedDateRange === '1m' ? 30 : selectedDateRange === '3m' ? 90 : 365);

  const expenses = filteredTransactions.filter(t => t.amount < 0);
  const income = filteredTransactions.filter(t => t.amount > 0);

  const totalExpenses = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const savingsRate = totalIncome !== 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(2) : '0.00';

  const expenseChartData = Object.entries(groupTransactionsByCategory(expenses)).map(([category, amount]) => ({ category, amount }));
  const topExpenses = getTopExpenses(filteredTransactions);

  return (
    <Box minH="100vh" bg={bgColor} color={textColor}>
      <Flex as="nav" bg="blue.600" p={4} color="white" justifyContent="space-between" alignItems="center">
        <Heading size="lg">FinTrack</Heading>
        <Button display={{ base: 'block', md: 'none' }} onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      </Flex>

      <Flex>
        <Box
          as={motion.div}
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          transition={{ duration: "0.3s" }} // Change the duration value to a string with "s" suffix
          position="fixed"
          left={0}
          top={0}
          bottom={0}
          width="64"
          bg="blue.700"
          color="white"
          p={4}
          zIndex={20}
          display={{ base: sidebarOpen ? 'block' : 'none', md: 'block' }}
        >
          <Flex direction="column" gap={4}>
            <Button variant="ghost">Dashboard</Button>
            <Button variant="ghost">Transactions</Button>
            <Button variant="ghost">Budgets</Button>
            <Button variant="ghost">Goals</Button>
            <Button variant="ghost">Reports</Button>
          </Flex>
        </Box>

        <Box flex={1} p={4} ml={{ md: sidebarOpen ? 64 : 0 }}>
          <Box mb={6}>
            <Heading size="md" mb={4}>Upload Your Transaction Data</Heading>
            <CsvUpload onDataUploaded={handleDataUploaded} />
          </Box>

          {transactions.length > 0 ? (
            <>
              <Flex mb={4} justifyContent="space-between" alignItems="center">
                <Heading size="xl">Dashboard</Heading>
                <Select value={selectedDateRange} onChange={(e) => setSelectedDateRange(e.target.value)} width="180px">
                  <option value="1m">Last Month</option>
                  <option value="3m">Last 3 Months</option>
                  <option value="1y">Last Year</option>
                </Select>
              </Flex>

              <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={4} mb={8}>
                <Card>
                  <CardHeader>
                    <Flex alignItems="center" justifyContent="space-between">
                      <Text fontSize="sm" fontWeight="medium">Total Balance</Text>
                      <DollarSign size={16} />
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <Stat>
                      <StatNumber>{formatCurrency(totalBalance)}</StatNumber>
                      <StatHelpText>{calculatePercentageChange(totalBalance - 1000, totalBalance)} from last month</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>
                    <Flex alignItems="center" justifyContent="space-between">
                      <Text fontSize="sm" fontWeight="medium">Total Expenses</Text>
                      <TrendingDown size={16} />
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <Stat>
                      <StatNumber>{formatCurrency(totalExpenses)}</StatNumber>
                      <StatHelpText>{calculatePercentageChange(totalExpenses + 100, totalExpenses)} from last month</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>
                    <Flex alignItems="center" justifyContent="space-between">
                      <Text fontSize="sm" fontWeight="medium">Savings Rate</Text>
                      <PieChartIcon size={16} />
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <Stat>
                      <StatNumber>{savingsRate}%</StatNumber>
                      <StatHelpText>+2.5% from last month</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
              </Grid>

              <Tabs>
                <TabList mb={4}>
                  <Tab>Overview</Tab>
                  <Tab>Expenses</Tab>
                  <Tab>Income</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={4}>
                      <Card>
                        <CardBody>
                          <ExpensesChart data={expenseChartData} />
                        </CardBody>
                      </Card>
                      <Card>
                        <CardBody>
                          <TransactionHistory transactions={filteredTransactions.slice(0, 10)} />
                        </CardBody>
                      </Card>
                    </Grid>
                  </TabPanel>
                  <TabPanel>
                    <Card>
                      <CardBody>
                        <ExpensesChart data={expenseChartData} />
                      </CardBody>
                    </Card>
                  </TabPanel>
                  <TabPanel>
                    <Card>
                      <CardBody>
                        <IncomeChart data={income} totalIncome={totalIncome} />
                      </CardBody>
                    </Card>
                  </TabPanel>
                </TabPanels>
              </Tabs>

              <Card mt={4}>
                <CardHeader>
                  <Heading size="md">Insights</Heading>
                </CardHeader>
                <CardBody>
                  <Flex direction="column" gap={4}>
                    <Flex alignItems="center" color="yellow.500">
                      <AlertCircle size={20} />
                      <Text ml={2}>You're approaching your monthly budget limit for Entertainment.</Text>
                    </Flex>
                    <Flex alignItems="center" color="green.500">
                      <TrendingUp size={20} />
                      <Text ml={2}>Your savings rate has improved by 5% compared to last month. Keep it up!</Text>
                    </Flex>
                    <Flex alignItems="center" color="blue.500">
                      <PieChartIcon size={20} />
                      <Text ml={2}>Your largest expense category this month is Food. Consider reviewing your grocery spending.</Text>
                    </Flex>
                  </Flex>
                </CardBody>
              </Card>
            </>
          ) : (
            <Box p={4}>
              <Text>Please upload your transaction data to view the dashboard.</Text>
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default FinanceDashboard;
