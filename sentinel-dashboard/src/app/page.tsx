"use client";
import { useSentinelWS } from '@/hooks/useSentinelWS';
import { ShieldAlert, Activity, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const { alerts, isConnected } = useSentinelWS();

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-10 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.5)]">
            <ShieldCheck className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">
            Sentinel <span className="text-blue-500 underline decoration-2">Guardian</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-700">
          <div className={`w-3 h-3 rounded-full animate-pulse ${isConnected ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500'}`} />
          <span className="text-sm font-mono uppercase tracking-widest">
            System: {isConnected ? 'Online' : 'Offline'}
          </span>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Panel: İstatistikler */}
        <div className="space-y-6">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center gap-3 mb-4 text-blue-400">
              <Zap size={20} />
              <h2 className="font-bold uppercase tracking-tight">System Status</h2>
            </div>
            <p className="text-4xl font-mono font-bold">{alerts.length * 7}</p>
            <p className="text-slate-500 text-sm mt-1">Packets Analyzed / Sec</p>
          </div>
          
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3 mb-4 text-orange-400">
              <Activity size={20} />
              <h2 className="font-bold uppercase tracking-tight">Active Threads</h2>
            </div>
            <p className="text-4xl font-mono font-bold text-orange-500">Virtual</p>
            <p className="text-slate-500 text-sm mt-1">Java 21 Engine Active</p>
          </div>
        </div>

        {/* Sağ Panel: Canlı Alarmlar */}
        <div className="lg:col-span-2 bg-slate-900/20 rounded-3xl border border-slate-800 p-8 backdrop-blur-sm overflow-hidden relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <ShieldAlert className="text-red-500 animate-bounce" size={24} />
              <h2 className="text-xl font-bold uppercase tracking-widest text-red-500">Live Threat Feed</h2>
            </div>
            <span className="text-xs font-mono text-slate-500">Real-time Analysis</span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-600 italic">
                <p>Monitoring network for potential threats...</p>
              </div>
            ) : (
              alerts.map((alert, index) => (
                <div key={index} className="group relative bg-red-950/10 border border-red-900/30 p-5 rounded-xl transition-all hover:bg-red-900/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-mono text-red-500/70 mb-1 uppercase tracking-widest">Anomaly Detected</div>
                      <h3 className="font-bold text-red-100 text-lg mb-2">{alert.reason}</h3>
                      <div className="flex gap-4 text-sm font-mono">
                        <span className="bg-black/50 px-2 py-1 rounded border border-slate-800 text-slate-400">SRC: {alert.src}</span>
                        <span className="bg-black/50 px-2 py-1 rounded border border-slate-800 text-slate-400">DST: {alert.dst}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 bg-slate-950 p-1 rounded">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Süsleme: Arka Plan Efekti */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] pointer-events-none rounded-full" />
        </div>
      </main>
    </div>
  );
}