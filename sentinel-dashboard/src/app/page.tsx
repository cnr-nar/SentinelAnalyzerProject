"use client";
import { useEffect } from 'react'; // useEffect ve useState eklendi
import { useSentinelWS ,useSentinelFirewall } from '@/hooks/useSentinelWS';
import { Activity, ShieldCheck, Zap, UserMinus, ShieldX, BrainCircuit, Globe, MapPin, History } from 'lucide-react';
import ThreatMap from '@/components/ThreatMap';

interface HistoryItem {
  srcIp: string;
  dstIp: string;
  reason: string;
  aiNote: string;
  country?: string;
  city?: string;
  timestamp: string;
}

interface Alert {
  src: string;
  dst: string;
  reason: string;
  aiNote: string;
  country: string;
  city: string;
  timestamp: string;
}

export default function Home() {
  const { alerts, setAlerts, isConnected } = useSentinelWS(); // setAlerts'i hook'tan aldığımızı varsayıyoruz
  const { bannedIPs, unblockIP } = useSentinelFirewall();

  // --- CİLA: HISTORY API ENTEGRASYONU ---
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:8082/api/alerts/history');
        if (response.ok) {
          const data: HistoryItem[] = await response.json();
          const formattedHistory: Alert[] = data.map((item: HistoryItem) => ({
            src: item.srcIp,
            dst: item.dstIp,
            reason: item.reason,
            aiNote: item.aiNote,
            country: item.country || 'Unknown',
            city: item.city || 'Unknown',
            timestamp: item.timestamp
          }));
          // Mevcut alertlerin üzerine geçmişi ekle (ancak dublike olmaması için dikkat)
          setAlerts(formattedHistory);
        }
      } catch (error) {
        console.error("Database history could not be fetched:", error);
      }
    };

    fetchHistory();
  }, [setAlerts]);

  const threatMapAlerts = alerts.map(alert => ({
    ...alert,
    country: alert.country || 'Unknown'
  }));

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans p-6 overflow-x-hidden">
      <style jsx global>{`
        @keyframes purpleGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(168, 85, 247, 0.2); border-color: rgba(168, 85, 247, 0.3); }
          50% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.5); border-color: rgba(168, 85, 247, 0.6); }
        }
        .animate-ai-glow { animation: purpleGlow 3s ease-in-out infinite; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>

      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">
            Sentinel <span className="text-blue-500 underline decoration-2 underline-offset-4">Guardian</span>
            <span className="ml-2 text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full not-italic tracking-normal">v2.0 Enterprise</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-700">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs font-mono font-bold uppercase tracking-tighter">
              {isConnected ? 'Link Stable' : 'Link Offline'}
            </span>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* HARİTA PANELİ */}
        <div className="lg:col-span-12 xl:col-span-8 order-2 xl:order-1">
           <ThreatMap alerts={threatMapAlerts} />
        </div>

        {/* STATS & FIREWALL */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6 order-1 xl:order-2">
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 text-blue-400 mb-2"><Zap size={16} /> <span className="text-[10px] font-bold uppercase">Throughput</span></div>
                <p className="text-2xl font-mono font-bold">{alerts.length * 12}</p>
             </div>
             <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 text-purple-400 mb-2"><BrainCircuit size={16} /> <span className="text-[10px] font-bold uppercase">Neural Load</span></div>
                <p className="text-2xl font-mono font-bold">%{Math.min(alerts.length * 3, 99)}</p>
             </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-red-900/30 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2 text-red-500 font-bold uppercase text-xs tracking-widest"><ShieldX size={18} /> <h2>Active Ban List</h2></div>
               <span className="bg-red-500/10 text-red-500 text-[10px] px-2 py-0.5 rounded-full border border-red-500/20 font-bold">{bannedIPs.length} IPs</span>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {bannedIPs.length === 0 ? (
                <div className="text-slate-600 text-[10px] uppercase text-center py-10 border border-dashed border-slate-800 rounded-xl">Grid Secure - No Bans</div>
              ) : (
                bannedIPs.map((ip) => (
                  <div key={ip} className="group flex justify-between items-center bg-red-950/10 border border-red-900/20 p-3 rounded-lg hover:bg-red-900/20 transition-colors">
                    <span className="font-mono text-sm text-red-200">{ip}</span>
                    <button onClick={() => unblockIP(ip)} className="p-1.5 text-slate-600 hover:text-green-400 hover:bg-green-500/10 rounded-md transition-all"><UserMinus size={14} /></button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* LOG AKIŞI */}
        <div className="lg:col-span-12 bg-slate-900/20 rounded-3xl border border-slate-800 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-red-500">
              <Activity className="animate-pulse" size={20} />
              <h2 className="text-sm font-black uppercase tracking-[0.2em]">Intercepted Threat Stream</h2>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <History size={12} /> <span>Syncing with PostgreSQL DB</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
            {alerts.length === 0 ? (
              <div className="col-span-full h-32 flex items-center justify-center text-slate-700 uppercase tracking-widest text-[10px]">Searching for Anomalies...</div>
            ) : (
              [...alerts].reverse().map((alert, index) => {
                const hasAI = alert.aiNote?.includes("CRITICAL");
                
                return (
                  <div key={index} className={`p-4 rounded-xl border transition-all hover:scale-[1.01] ${hasAI ? 'bg-purple-950/10 border-purple-500/30 animate-ai-glow' : 'bg-red-950/5 border-red-900/20'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                         <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${hasAI ? 'text-purple-400 bg-purple-500/10' : 'text-red-500 bg-red-500/10'}`}>
                           {hasAI ? 'Auto-Evolved' : 'Standard'}
                         </span>
                         <h3 className="font-bold text-sm text-slate-200">{alert.reason}</h3>
                      </div>
                      <span className="text-[9px] font-mono text-slate-600">{alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}</span>
                    </div>

                    {/* AI NOTE DISPLAY */}
                    {alert.aiNote && (
                      <div className="mb-3 p-2 bg-purple-900/20 border-l-2 border-purple-500 rounded-r-md">
                        <p className="text-[10px] text-purple-300 italic font-mono leading-relaxed">
                          <span className="font-bold">AI Insight:</span> {alert.aiNote}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-[11px] font-mono">
                      <div className="flex-1 bg-black/40 p-2 rounded border border-slate-800/50">
                        <span className="text-slate-500 text-[8px] block uppercase">Origin</span>
                        <div className="flex items-center gap-1.5">
                           <MapPin size={10} className="text-blue-500" />
                           <span className="text-slate-300">{alert.src}</span>
                           <span className="text-blue-400/60 text-[9px] ml-auto font-bold">[{alert.country}]</span>
                        </div>
                      </div>
                      <div className="flex-1 bg-black/40 p-2 rounded border border-slate-800/50">
                        <span className="text-slate-500 text-[8px] block uppercase">Target</span>
                        <div className="flex items-center gap-1.5">
                           <Globe size={10} className="text-slate-500" />
                           <span className="text-slate-400">{alert.dst}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}