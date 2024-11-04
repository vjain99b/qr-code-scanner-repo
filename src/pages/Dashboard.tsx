import { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Line } from 'react-chartjs-2';
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
import { MapPin } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ScanData {
  total: number;
  locations: { [key: string]: number };
  dailyScans: { [key: string]: number };
}

export default function Dashboard() {
  const [scanData, setScanData] = useState<ScanData>({
    total: 0,
    locations: {},
    dailyScans: {}
  });

  useEffect(() => {
    const fetchScanData = async () => {
      const scansRef = collection(db, 'scans');
      const scansSnapshot = await getDocs(query(scansRef));
      
      const data: ScanData = {
        total: scansSnapshot.size,
        locations: {},
        dailyScans: {}
      };

      scansSnapshot.forEach((doc) => {
        const scan = doc.data();
        // Aggregate location data
        if (scan.location) {
          data.locations[scan.location] = (data.locations[scan.location] || 0) + 1;
        }
        // Aggregate daily scans
        const date = new Date(scan.timestamp?.toDate()).toLocaleDateString();
        data.dailyScans[date] = (data.dailyScans[date] || 0) + 1;
      });

      setScanData(data);
    };

    fetchScanData();
  }, []);

  const chartData = {
    labels: Object.keys(scanData.dailyScans),
    datasets: [
      {
        label: 'Daily Scans',
        data: Object.values(scanData.dailyScans),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Scans</h2>
          <p className="text-3xl font-bold text-indigo-600">{scanData.total}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Unique Locations</h2>
          <p className="text-3xl font-bold text-indigo-600">
            {Object.keys(scanData.locations).length}
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Average Daily Scans
          </h2>
          <p className="text-3xl font-bold text-indigo-600">
            {Object.keys(scanData.dailyScans).length
              ? Math.round(
                  scanData.total / Object.keys(scanData.dailyScans).length
                )
              : 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Scan Trends</h2>
          <Line data={chartData} />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Top Locations</h2>
          <div className="space-y-4">
            {Object.entries(scanData.locations)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([location, count]) => (
                <div
                  key={location}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-indigo-600" />
                    <span className="font-medium text-gray-700">{location}</span>
                  </div>
                  <span className="text-gray-600">{count} scans</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}