import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
// Small runtime check to help debug charts in the browser console
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.debug('ChartJS registered, version:', (ChartJS as any)?.version || 'unknown');
}

export default defineNuxtPlugin(() => {});
