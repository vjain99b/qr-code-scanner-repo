import { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { QrCode, ExternalLink, Trash2, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { QRCodeCanvas } from 'qrcode.react';

interface QRCode {
  id: string;
  name: string;
  createdAt: Date;
  scans: number;
  url: string;
}

export default function QRCodes() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedQRCode, setSelectedQRCode] = useState<QRCode | null>(null);

  useEffect(() => {
    const fetchQRCodes = async () => {
      const qrCodesRef = collection(db, 'qrCodes');
      const qrCodesSnapshot = await getDocs(query(qrCodesRef));
      toast.success('HERE WE GO!');
      console.log(qrCodesSnapshot.docs);

      const codes = qrCodesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as QRCode[];

      setQrCodes(codes);
      console.log(codes);
    };

    fetchQRCodes();
  }, []);

  const handleDeleteCode = async (id: string | number) => {
    try {
      await deleteDoc(doc(db, 'qrCodes', String(id)));
      // Update the qrCodes state to reflect the deletion
      setQrCodes(qrCodes.filter((code) => code.id !== id));
    } catch (error) {
      console.error('Error deleting QR code:', error);
    }
  };

  const handleDownloadQRCode = (url: string, uniqueCode: string) => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${uniqueCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRowClick = (code: QRCode) => {
    if (!code) {
      console.error('Error: code is null or undefined');
      return;
    }
    const qrCodeUrl = `${window.location.origin}/preview/${code.id}`;
    setSelectedQRCode({ ...code, url: qrCodeUrl });
    setShowQRCode(true);

    if (!selectedQRCode) {
      console.error('Error: selectedQRCode is null or undefined');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">QR Codes</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scans
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {qrCodes.map((code) => (
                <tr key={code.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(code)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <QrCode className="h-5 w-5 text-gray-400 mr-3" />
                      <div className="text-sm font-medium text-gray-900">
                        {code.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {code.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {code.scans}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3">
                      <a
                        href={"preview/" + code.id}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                      <button
                        onClick={() => handleDownloadQRCode(code.id, code.url)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCode(code.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showQRCode && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">QR Code</h2>
            <div className="flex justify-center mb-4">
              {selectedQRCode?.url && (
                <QRCodeCanvas value={selectedQRCode.url} size={200} />
              )}
            </div>
            <div className="text-sm text-gray-500">
              Unique Code: <span className="font-mono">{selectedQRCode?.id}</span>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setShowQRCode(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
