'use client';
import { parse } from 'papaparse';
import { useState } from 'react';

export type Seat = {
  section: string;
  row: string;
  number: number;
  price: number;
  type?: string;
};

export function useSeatImport() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    parse(file, {
      header: true,
      complete: (results) => {
        try {
          const importedSeats = results.data.map((row: any) => ({
            section: row.Section || 'Main',
            row: row.Row,
            number: parseInt(row.Number),
            price: parseFloat(row.Price),
            type: row.Type || 'standard'
          }));
          setSeats(importedSeats);
          setError(null);
        } catch (err) {
          setError('Invalid file format');
        }
      },
      error: () => setError('Error parsing file')
    });
  };

  return { seats, handleFileUpload, error, setSeats };
}

export default function SeatImport() {
  const { seats, handleFileUpload, error } = useSeatImport();

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-2">Import Seating Chart</h3>
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}