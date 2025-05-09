
'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const dummyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const dummyData = [3000000, 4200000, 2100000, 5200000, 4100000, 7000000];

const data = {
  labels: dummyLabels,
  datasets: [
    {
      label: 'Pendapatan (Rp)',
      data: dummyData,
      fill: false,
      borderColor: '#facc15', // kuning
      tension: 0.3
    }
  ]
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true,
      text: 'Grafik Pendapatan per Bulan'
    }
  },
  scales: {
    y: {
      ticks: {
        callback: function (value: string | number) {
          if (typeof value === 'number') {
            return 'Rp ' + value.toLocaleString();
          }
          return value;
        }
      }
    }
  }
};

export default function ChartSection() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-200">
      <Line options={options} data={data} />
    </div>
  );
}
