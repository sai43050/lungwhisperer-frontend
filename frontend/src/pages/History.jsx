import { useEffect, useState } from 'react';
import { getHistory } from '../api';
import { Activity, Clock, AlertCircle } from 'lucide-react';

export default function History({ user }) {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory(user.user_id);
        setScans(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading your history...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center mb-8">
        <Activity className="h-8 w-8 text-healthcare-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-800">Scan History</h2>
      </div>

      {scans.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700">No Previous Scans Found</h3>
          <p className="text-gray-500 mt-2">You haven't analyzed any X-rays yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-6 font-semibold text-sm text-gray-500 uppercase">Record ID</th>
                <th className="py-4 px-6 font-semibold text-sm text-gray-500 uppercase">Date</th>
                <th className="py-4 px-6 font-semibold text-sm text-gray-500 uppercase">Detection</th>
                <th className="py-4 px-6 font-semibold text-sm text-gray-500 uppercase text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {scans.map((scan) => {
                const isNormal = scan.prediction.toLowerCase() === 'normal';
                return (
                  <tr key={scan.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">#{scan.id}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">{new Date(scan.timestamp).toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isNormal ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {!isNormal && <AlertCircle className="w-3 h-3 mr-1" />}
                        {scan.prediction}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900 font-bold text-right">
                      {scan.confidence}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
