// src/components/CsvUpload.tsx

import React, { useState } from 'react';
import { Button, Input, Box, Text } from '@chakra-ui/react';
import Papa from 'papaparse';

interface Transaction {
  date: string;
  description: string;
  amount: number;
  category: string;
}

interface CsvUploadProps {
  onDataUploaded: (data: Transaction[]) => void;
}

const CsvUpload: React.FC<CsvUploadProps> = ({ onDataUploaded }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const transactions: Transaction[] = result.data.map((row: any) => ({
            date: row.Date,
            description: row.Description,
            amount: parseFloat(row.Amount),
            category: row.Category || 'Uncategorized',
          }));
          onDataUploaded(transactions);
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  };

  return (
    <Box>
      <Input type="file" accept=".csv" onChange={handleFileChange} />
      <Button onClick={handleUpload} mt={2} isDisabled={!file}>
        Upload CSV
      </Button>
      {file && <Text mt={2}>Selected file: {file.name}</Text>}
    </Box>
  );
};

export default CsvUpload;
