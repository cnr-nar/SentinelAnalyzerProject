"use client";
import { useSentinelWS } from '@/hooks/useSentinelWS';
import { useSentinelFirewall } from '@/hooks/useSentinelWS'; // Aynı dosyadan export edildikleri için
import { ShieldAlert, Activity, ShieldCheck, Zap, UserMinus, ShieldX } from 'lucide-react';

export default function Home() {
  const { alerts, isConnected } = useSentinelWS();
  // Hook içindeki isim 'bannedIPs' ve 'unblockIP' olduğu için burada onları karşılıyoruz
  const { bannedIPs, unblockIP } = useSentinelFirewall();

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
          <span className="text-sm font-mono uppercase tracking-widest text-xs">
            System: {isConnected ? 'Online' : 'Offline'}
          </span>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL PANEL: Firewall & Stats */}
        <div className="space-y-6">
          
          {/* Firewall Yönetimi */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-red-900/30 shadow-[inset_0_0_20px_rgba(220,38,38,0.05)]">
            <div className="flex items-center gap-3 mb-6 text-red-500 font-bold uppercase tracking-tight italic">
              <ShieldX size={20} />
              <h2>Firewall Control</h2>
            </div>
            
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
              {bannedIPs.length === 0 ? (
                <div className="text-slate-600 text-xs italic text-center py-8 border border-dashed border-slate-800 rounded-xl">
                  No active threats blocked.
                </div>
              ) : (
                bannedIPs.map((ip) => (
                  <div key={ip} className="flex justify-between items-center bg-red-950/10 border border-red-900/20 p-3 rounded-xl hover:border-red-500/40 transition-all group">
                    <span className="font-mono text-sm text-red-200">{ip}</span>
                    <button 
                      onClick={() => unblockIP(ip)}
                      className="p-1.5 text-slate-500 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                      title="Unblock IP"
                    >
                      <UserMinus size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sistem Metrikleri */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3 mb-4 text-blue-400">
              <Zap size={20} />
              <h2 className="font-bold uppercase tracking-tight">Real-time Load</h2>
            </div>
            <p className="text-4xl font-mono font-bold">{alerts.length * 12}</p>
            <p className="text-slate-500 text-sm mt-1 font-mono uppercase text-[10px] tracking-widest">Global Analysis / Sec</p>
          </div>
        </div>

        {/* SAĞ PANEL: Canlı Tehdit Akışı */}
        <div className="lg:col-span-2 bg-slate-900/20 rounded-3xl border border-slate-800 p-8 backdrop-blur-sm overflow-hidden relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4 text-red-500">
              <ShieldAlert className="animate-pulse" size={24} />
              <h2 className="text-xl font-bold uppercase tracking-[0.15em]">Security Logs</h2>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-mono text-slate-500 uppercase">Live Intel Stream</span>
               <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></div>
            </div>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-600 italic">
                <p>Waiting for incoming network data...</p>
              </div>
            ) : (
              alerts.map((alert, index) => (
                <div key={index} className="group relative bg-red-950/10 border border-red-900/30 p-5 rounded-xl transition-all hover:bg-red-900/20 hover:scale-[1.01] duration-300">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 uppercase tracking-widest font-bold">Alert</span>
                        <h3 className="font-bold text-red-100 text-lg tracking-tight">{alert.reason}</h3>
                      </div>
                      <div className="flex gap-3 text-sm font-mono">
                        <div className="bg-black/60 px-3 py-1.5 rounded-lg border border-slate-800">
                           <span className="text-slate-500 text-[10px] block uppercase mb-0.5">Source</span>
                           <span className="text-slate-300">{alert.src}</span>
                        </div>
                        <div className="bg-black/60 px-3 py-1.5 rounded-lg border border-slate-800">
                           <span className="text-slate-500 text-[10px] block uppercase mb-0.5">Destination</span>
                           <span className="text-slate-300">{alert.dst}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 blur-[120px] pointer-events-none rounded-full" />
        </div>
      </main>
    </div>
  );
}