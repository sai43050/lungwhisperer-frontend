import React, { useEffect, useState } from 'react';
import { getAllPatients, generateMedicalReport } from '../api';
import { AlertTriangle, ShieldCheck, Activity, User, PhoneCall, BrainCircuit, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const PatientRow = ({ patient }) => {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  
  const v = patient.latest_vitals || { spo2: '--', heart_rate: '--', respiratory_rate: '--' };
  
  const statusColors = {
    Normal: 'bg-green-100 text-green-700 border-green-200',
    Warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Critical: 'bg-red-100 text-red-700 border-red-200',
    Unknown: 'bg-slate-100 text-slate-700 border-slate-200',
  };
  
  const statusColor = statusColors[patient.status] || statusColors.Unknown;
  
  const fetchReport = async () => {
    if (report) { setReport(null); return; } // Toggle close
    setLoadingReport(true);
    try {
      const data = await generateMedicalReport(patient.id);
      setReport(data.report);
    } catch (e) {
      setReport("Error generating AI Report: " + (e.response?.data?.detail || e.message));
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4 hover:border-healthcare-300 transition-all flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-healthcare-50 p-3 rounded-full text-healthcare-600">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-lg">{patient.username}</h4>
            <p className="text-slate-500 text-sm">Patient ID: #{patient.id.toString().padStart(4, '0')}</p>
          </div>
        </div>
        
        <div className="flex gap-8 px-6">
          <div className="text-center">
            <p className="text-xs text-slate-500 font-medium mb-1">SpO2</p>
            <p className="font-bold text-slate-700">{v.spo2}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 font-medium mb-1">HR</p>
            <p className="font-bold text-slate-700">{Math.round(v.heart_rate)} bpm</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 font-medium mb-1">Resp</p>
            <p className="font-bold text-slate-700">{Math.round(v.respiratory_rate)} /min</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${statusColor}`}>
            {patient.status}
          </span>
          <button 
            onClick={fetchReport}
            className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors flex items-center gap-2"
            title="Generate AI Report"
          >
            {loadingReport ? <Activity className="h-5 w-5 animate-spin" /> : <BrainCircuit className="h-5 w-5" />}
          </button>
          <button 
            onClick={() => navigate('/telemedicine')}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
            title="Start Telemedicine Call"
          >
            <PhoneCall className="h-5 w-5" />
          </button>
        </div>
      </div>

      {report && (
        <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-xl relative group">
          <button onClick={() => setReport(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
             <X size={20} />
          </button>
          <h5 className="font-bold tracking-tight text-indigo-700 flex items-center gap-2 mb-3">
             <BrainCircuit size={18} /> LLM Intelligence Report
          </h5>
          <div className="prose prose-sm prose-indigo max-w-none text-slate-700">
             <ReactMarkdown>{report}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

const DoctorPanel = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getAllPatients();
      // Sort so critical is first
      const sorted = data.sort((a, b) => {
        const priority = { 'Critical': 3, 'Warning': 2, 'Normal': 1, 'Unknown': 0 };
        return priority[b.status] - priority[a.status];
      });
      setPatients(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const criticalCount = patients.filter(p => p.status === 'Critical').length;
  const warningCount = patients.filter(p => p.status === 'Warning').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin / Doctor Panel</h1>
          <p className="text-slate-500 text-sm mt-1">Live monitoring of all registered patients.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-red-100 text-red-600 p-3 rounded-lg">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-500 font-medium text-sm">Critical Patients</p>
            <h3 className="text-2xl font-bold text-slate-800">{criticalCount}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-500 font-medium text-sm">Warning Status</p>
            <h3 className="text-2xl font-bold text-slate-800">{warningCount}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-healthcare-50 text-healthcare-600 p-3 rounded-lg">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-slate-500 font-medium text-sm">Total Monitored</p>
            <h3 className="text-2xl font-bold text-slate-800">{patients.length}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 overflow-hidden">
        <h3 className="font-bold text-slate-800 text-lg mb-6">Patient Overview</h3>
        {loading ? (
          <p className="text-slate-500">Loading patients...</p>
        ) : patients.length === 0 ? (
          <p className="text-slate-500">No patients currently registered.</p>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {patients.map(p => (
              <PatientRow key={p.id} patient={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPanel;
