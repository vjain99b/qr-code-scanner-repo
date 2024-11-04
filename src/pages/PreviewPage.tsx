import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';
import { getAuth } from 'firebase/auth';

const auth = getAuth();

interface PageData {
  name: string;
  scans: string;
  logo : string;
  productImage: string;
  description: string;
  footer: string;
  sections: any;
}

export default function PreviewPage() {
  const { code } = useParams();
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      if (!code) return;

      try {
        const userId = auth.currentUser?.uid;
        const docRef = doc(db, `users/${userId}/qrCodes`, code);
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data());
        console.log(docSnap.data()?.name);
        if (docSnap.exists()) {
          setPageData(docSnap.data() as PageData);
        }
      } catch (error) {
        console.error('Error fetching page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600">The QR code you scanned doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  toast.success('!NO PAGE DATA!');
  toast.success(pageData.name);
  console.log("here");
  console.log(pageData.name);
  console.log(pageData.scans);
  console.log(pageData.sections[0].content);


  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {pageData.sections[0].content && (
          <div className="flex justify-center mb-8">
            <img
              src={pageData.sections[0].content}
              alt="Logo"
              className="h-16 object-contain"
            />
          </div>
        )}

        {pageData.sections[1].content && (
          <div className="mb-8">
            <img
              src={pageData.sections[1].content}
              alt="Product"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )}

        {pageData.sections[2].content && (
          <div className="prose max-w-none mb-8">
            <div className="text-gray-700 leading-relaxed"
                 dangerouslySetInnerHTML={{ __html: pageData.sections[2].content }}
            />
          </div>
        )}

        {pageData.sections[3].content && (
          <div className="border-t pt-4 text-sm text-gray-500">
            {pageData.sections[3].content}
          </div>
        )}
      </div>
    </div>
  );
}
