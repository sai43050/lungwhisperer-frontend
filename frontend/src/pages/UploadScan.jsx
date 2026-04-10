import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { predictScan } from '../api';
import { motion } from 'framer-motion';

export default function UploadScan({ user }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setError(null);
    } else {
      setError("Please upload a valid image file.");
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      const result = await predictScan(user.user_id, file);
      // Navigate to results page passing the result via state
      navigate(`/results/${result.id}`, { state: { result } });
    } catch (err) {
      setError("Failed to process the scan. Please try again or check backend connection.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pt-6 relative z-10">
      <div className="glass-panel p-8 sm:p-12 rounded-3xl">
        <h2 className="text-4xl font-display font-extrabold text-white mb-2 tracking-wide">Initialize X-Ray Scan</h2>
        <p className="text-vignan-200 mb-10 font-light">
          Upload a clear DICOM, JPEG, or PNG image of the patient's chest X-ray for ResNet-18 analysis.
        </p>

        <div 
          className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${file ? 'border-accent-400 bg-accent-500/10' : 'border-vignan-600/50 hover:border-accent-400/50 bg-slate-900/40 backdrop-blur-md'}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {!preview ? (
            <div className="flex flex-col items-center">
              <div className="p-4 bg-vignan-800/80 rounded-full mb-6 border border-vignan-600/50 shadow-inner">
                <UploadCloud className="h-10 w-10 text-accent-400" />
              </div>
              <p className="text-lg text-slate-300 mb-4 font-medium">Drag and drop your scan here, or</p>
              <label className="cursor-pointer bg-gradient-to-r from-accent-500 to-vignan-500 hover:from-accent-400 hover:to-vignan-400 text-white font-bold py-3 px-8 rounded-full transition-all shadow-[0_0_15px_rgba(0,154,228,0.3)] hover:shadow-[0_0_20px_rgba(0,154,228,0.6)]">
                Browse Files
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
              <p className="text-sm text-vignan-400 mt-6 tracking-wide">Supported formats: JPEG, PNG, WEBP</p>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,154,228,0.2)] border border-accent-500/30 mb-6 bg-slate-900/80 p-2">
                <img src={preview} alt="X-Ray Preview" className="max-h-80 object-contain rounded-xl" />
                <button 
                  className="absolute top-4 right-4 bg-red-500/20 backdrop-blur-md border border-red-500/50 rounded-full p-2 text-red-400 shadow-lg hover:bg-red-500 hover:text-white transition-all"
                  onClick={() => { setFile(null); setPreview(null); }}
                >
                  <AlertCircle className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center space-x-2 text-accent-400 font-medium mb-2 bg-accent-500/10 px-4 py-2 rounded-full border border-accent-500/20">
                <CheckCircle className="h-5 w-5" />
                <span>Image loaded sequence ready: {file.name}</span>
              </div>
            </motion.div>
          )}
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl flex items-center backdrop-blur-md">
            <AlertCircle className="h-5 w-5 mr-3" />
            {error}
          </div>
        )}

        {file && (
          <div className="mt-8 flex justify-end border-t border-vignan-700/50 pt-8">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="flex items-center bg-white text-vignan-900 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-white font-bold py-3.5 px-8 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all"
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-3 text-accent-500" />
                  Processing Radiography...
                </>
              ) : (
                'Run AI Inference'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
