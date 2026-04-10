import { Code, Server, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">About AeroVision Health</h2>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6 text-gray-600 leading-relaxed">
        <p>
          The <strong>AI-Based Lung Disease Detection System</strong> is designed to aid medical professionals in quickly screening chest X-ray images for common lung ailments.
        </p>
        
        <div className="p-6 bg-slate-50 rounded-xl mt-6 border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <Heart className="text-red-500 w-5 h-5 mr-2" fill="currentColor" />
            Core Mission
          </h3>
          <p className="text-sm">
            To provide a scalable, fast, and highly accurate preliminary assessment tool, augmenting the diagnostic capabilities of radiologists and reducing time-to-treatment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow">
            <Code className="text-healthcare-600 w-6 h-6 mb-3" />
            <h4 className="font-bold text-gray-800">Frontend Technology</h4>
            <ul className="text-sm space-y-1 mt-2">
              <li>ReactJS</li>
              <li>Vite & Tailwind CSS</li>
              <li>Framer Motion</li>
            </ul>
          </div>
          <div className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow">
            <Server className="text-healthcare-600 w-6 h-6 mb-3" />
            <h4 className="font-bold text-gray-800">Backend Technology</h4>
            <ul className="text-sm space-y-1 mt-2">
              <li>FastAPI (Python)</li>
              <li>SQLite / PostgreSQL</li>
              <li>Mock ML Inference Engine</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
