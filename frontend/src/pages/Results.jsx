import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="text-center py-20 flex flex-col items-center">
        <AlertCircle className="h-16 w-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">No Result Data Found</h2>
        <p className="text-gray-500 mt-2 mb-6">Please upload a scan to see results.</p>
        <button onClick={() => navigate('/upload')} className="text-healthcare-600 hover:underline">
          Go to Upload
        </button>
      </div>
    );
  }

  const rawPrediction = result.prediction;
  const isAudio = rawPrediction.startsWith("COUGH: ");
  const predictionText = rawPrediction.replace("X-RAY: ", "").replace("COUGH: ", "");

  const isNormal = predictionText.toLowerCase() === 'normal' || predictionText.toLowerCase() === 'healthy';
  const confidenceColor = result.confidence > 90 ? 'bg-green-500' : (result.confidence > 75 ? 'bg-yellow-500' : 'bg-red-500');

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => navigate('/upload')}
        className="flex items-center text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to Upload
      </button>

      <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
        <div className={`p-8 font-bold text-xl flex items-center justify-between text-white ${isNormal ? 'bg-green-600' : 'bg-red-500'}`}>
          <div className="flex items-center">
            {isNormal ? <CheckCircle2 className="h-8 w-8 mr-3" /> : <AlertCircle className="h-8 w-8 mr-3" />}
            Analysis Result: {predictionText}
          </div>
          <span className="text-sm font-medium bg-white/20 px-4 py-1 rounded-full">
            Record ID: #{result.id}
          </span>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Patient Scan</h3>
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              {/* Note: In a real app we'd fetch the image securely. Here we just show a local dummy or rely on backend serving static files if we set it up. */}
              <div className="h-64 flex items-center justify-center text-gray-400">
                <p>Image securely stored.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Confidence Score</h3>
              <div className="flex items-end mb-2">
                <span className="text-4xl font-extrabold text-gray-800">{result.confidence}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${result.confidence}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-3 rounded-full ${confidenceColor}`}
                ></motion.div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="text-blue-800 font-bold mb-2">Clinical Recommendation</h3>
              <p className="text-blue-600 text-sm leading-relaxed">
                {isNormal 
                  ? "The AI model detected no significant abnormalities in the provided scan. However, clinical correlation is always recommended."
                  : `Signs of ${result.prediction} detected. Immediate review by a radiologist or pulmonologist is advised to confirm findings and determine treatment steps.`}
              </p>
            </div>
            
            <div className="text-xs text-gray-400">
              Analyzed on: {new Date(result.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
