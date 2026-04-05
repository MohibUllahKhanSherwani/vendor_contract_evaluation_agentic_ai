import React from 'react';
import { Brain, Shield, Target, AlertCircle, TrendingUp, Info, CheckCircle2, Search, XCircle, Sparkles } from 'lucide-react';

const ReasoningChain = ({ reasoning, isAnalyzing }) => {
    if (isAnalyzing) {
        return (
            <div className="card mt-16 border-white/5 animate-pulse relative overflow-hidden h-[500px] flex flex-col items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
                <div className="bg-white/5 p-5 rounded-3xl mb-8 border border-white/10 shadow-2xl">
                    <Sparkles className="w-10 h-10 text-accent animate-spin-slow" />
                </div>
                <div className="space-y-4 text-center">
                    <h3 className="text-white font-black uppercase text-xs tracking-[0.3em]">Synthesizing Logic Matrices</h3>
                    <p className="text-slate-500 text-sm font-medium">Reconstructing vendor risk profiles across 4 data silos...</p>
                </div>
                <div className="mt-12 flex gap-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-2 h-2 bg-accent/40 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                </div>
            </div>
        );
    }

    if (!reasoning || !reasoning.reasoning_chain) return null;

    const getStepIcon = (index) => {
        const icons = [TrendingUp, Shield, Target, Info, AlertCircle];
        const Icon = icons[index % icons.length];
        return <Icon className="w-4 h-4 text-white" />;
    };

    const getRecommendationStyle = (rec) => {
        const normalized = (rec || '').toUpperCase();
        switch (normalized) {
            case 'RENEW': return { color: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', icon: CheckCircle2, glow: 'shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]' };
            case 'TERMINATE': return { color: 'text-rose-400', bg: 'bg-rose-500/5', border: 'border-rose-500/20', icon: XCircle, glow: 'shadow-[0_0_20px_-5px_rgba(244,63,94,0.3)]' };
            case 'RENEGOTIATE': 
            case 'MONITOR': return { color: 'text-amber-400', bg: 'bg-amber-500/5', border: 'border-amber-500/20', icon: Search, glow: 'shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]' };
            default: return { color: 'text-accent', bg: 'bg-accent/5', border: 'border-accent/20', icon: Info, glow: 'shadow-[0_0_20px_-5px_rgba(94,106,210,0.3)]' };
        }
    };

    const style = getRecommendationStyle(reasoning.recommendation);
    const RecIcon = style.icon;

    return (
        <div className="card mt-24 border-white/5 bg-[#1a1f2e] shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {/* Ambient Header Glow */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#6366f1]/5 to-transparent pointer-events-none" />

            {/* Report Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-20 pb-16 border-b border-white/5 relative z-10 mx-4">
                <div className="flex items-center gap-8">
                    <div className="bg-[#6366f1] p-5 rounded-[32px] shadow-2xl shadow-[#6366f1]/20 group-hover:scale-110 transition-all duration-700">
                        <Brain className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-[10px] font-black text-[#6366f1] uppercase tracking-[0.4em] opacity-80">Synthesis Analysis</span>
                            <div className="h-[1px] w-8 bg-[#6366f1]/30" />
                        </div>
                        <h3 className="text-5xl font-black text-white tracking-tighter leading-none">
                            {reasoning.vendor_name || 'Evaluation Profile'}
                        </h3>
                    </div>
                </div>

                <div className={`flex items-center gap-6 px-10 py-6 rounded-[32px] border ${style.bg} ${style.border} ${style.glow} transition-all duration-700 backdrop-blur-xl group hover:border-[#6366f1]/50`}>
                    <div className={`p-3 rounded-2xl border border-white/10 bg-white/5 shadow-inner`}>
                        <RecIcon className={`w-8 h-8 ${style.color}`} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-3 opacity-60">Strategic Outcome</p>
                        <p className={`text-3xl font-black ${style.color} leading-none tracking-tight`}>
                            {reasoning.recommendation || 'PENDING'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 relative z-10 mx-4">
                {/* Left side: Logic Pathway timeline (Col 7) */}
                <div className="lg:col-span-7">
                    <div className="flex items-center gap-5 mb-14">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#64748b]">Logic Flow Pathway</h4>
                        <div className="h-[1px] flex-1 bg-white/[0.03]" />
                    </div>

                    <div className="space-y-12 relative pl-16">
                        {/* Timeline Connector */}
                        <div className="absolute left-[31px] top-6 bottom-6 w-[1.5px] bg-gradient-to-b from-[#6366f1]/40 via-[#6366f1]/10 to-transparent z-0" />
                        
                        {reasoning.reasoning_chain.map((step, idx) => (
                            <div key={idx} className="relative z-10 group">
                                <div className="absolute -left-[54px] top-0 w-11 h-11 border border-white/5 bg-[#0f1117] rounded-full flex items-center justify-center transition-all group-hover:border-[#6366f1] group-hover:bg-[#6366f1] group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] duration-500 overflow-hidden">
                                     <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {getStepIcon(idx)}
                                </div>
                                <div className="bg-white/[0.015] rounded-[32px] p-8 border border-white/5 transition-all group-hover:bg-white/[0.03] group-hover:border-white/10 group-hover:translate-x-2 duration-500">
                                    <p className="text-slate-400 leading-relaxed text-[15px] font-medium tracking-tight opacity-90 group-hover:opacity-100 transition-opacity">{step}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right side: Executive Summary (Col 5) */}
                <div className="lg:col-span-5">
                    <div className="sticky top-12 space-y-12">
                        <div className="p-12 bg-white/[0.015] rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366f1]/5 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            
                            <div className="flex items-center justify-between mb-14 relative z-10">
                                <div className="flex items-center gap-3">
                                    <p className="text-[11px] font-black text-[#64748b] uppercase tracking-[0.3em]">Executive Summary</p>
                                </div>
                                <span className={`px-4 py-2 rounded-2xl text-[9px] font-black border tracking-[0.2em] shadow-lg ${
                                    reasoning.confidence_level === 'HIGH' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5' :
                                    reasoning.confidence_level === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/5' :
                                    'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/5'
                                }`}>
                                    CERTIFIED: {reasoning.confidence_level}
                                </span>
                            </div>

                            <div className="relative z-10">
                                <div className="mb-8 text-indigo-500/30">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                                <p className="text-slate-300 text-[17px] leading-[1.8] font-medium tracking-tight lowercase first-letter:uppercase">
                                    {reasoning.justification || 'Data analysis successfully synthesized with nominal variance across all evaluation vectors.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReasoningChain;
