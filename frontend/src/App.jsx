import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, Zap, Brain, TrendingUp, ShieldCheck, LogOut, User as UserIcon } from 'lucide-react';
import ContractTable from './components/ContractTable';
import StatsCard from './components/StatsCard';
import PerformanceChart from './components/PerformanceChart';
import RiskHeatmap from './components/RiskHeatmap';
import ReasoningChain from './components/ReasoningChain';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import { fetchVendors, evaluateSample } from './services/api';

function App() {
    const [user, setUser] = useState(null);
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analyzingId, setAnalyzingId] = useState(null);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [selectedContract, setSelectedContract] = useState(null);
    const [showLanding, setShowLanding] = useState(true);
    const [authIsLogin, setAuthIsLogin] = useState(true);

    const loadVendors = async () => {
        if (!user) return;
        try {
            setLoading(true);
            setError(null);
            const data = await fetchVendors();
            setContracts(data);
            setLastUpdate(new Date());
        } catch (err) {
            setError(err.message);
            console.error('Error loading vendors:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectContract = async (contract) => {
        if (contract.status === 'completed') {
            setSelectedContract(contract);
            return;
        }

        const nameMap = {
            "ABC IT Solutions": "vendor_abc_it_solutions",
            "XYZ Tech Services": "vendor_xyz_tech",
            "Problematic IT Corp": "vendor_problematic_corp"
        };

        const sampleName = contract.sample_key || nameMap[contract.vendor_name];
        if (!sampleName) return;

        try {
            setAnalyzingId(contract.contract_id);
            setError(null);
            const updatedData = await evaluateSample(sampleName);
            setContracts(prev => prev.map(c =>
                c.contract_id === contract.contract_id ? updatedData : c
            ));
            setSelectedContract(updatedData);
            setLastUpdate(new Date());
        } catch (err) {
            setError(`Analysis for ${contract.vendor_name} failed: ${err.message}`);
        } finally {
            setAnalyzingId(null);
        }
    };

    useEffect(() => {
        if (user) {
            loadVendors();
        }
    }, [user]);

    const handleLogout = () => {
        setUser(null);
        setContracts([]);
        setSelectedContract(null);
    };

    if (!user) {
        if (showLanding) {
            return <LandingPage
                onLogin={() => { setAuthIsLogin(true); setShowLanding(false); }}
                onSignUp={() => { setAuthIsLogin(false); setShowLanding(false); }}
            />;
        }
        return <Auth onAuthSuccess={setUser} onBackToLanding={() => setShowLanding(true)} initialIsLogin={authIsLogin} />;
    }

    const evaluatedContracts = contracts.filter(c => c.status === 'completed');

    return (
        <div className="flex min-h-screen bg-[#0f1117] text-[#e2e8f0] selection:bg-[#6366f1]/30">
            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-white/5 flex flex-col bg-[#1a1f2e] sticky top-0 h-screen z-30">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="bg-[#6366f1] p-1.5 rounded-lg shadow-lg shadow-[#6366f1]/20">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-sm font-black tracking-tight leading-none text-white">Contract Evaluations</h1>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#64748b] mt-1.5">Platform v4.0</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-white bg-white/5 rounded-xl border border-white/5 transition-all">
                            <TrendingUp className="w-4 h-4 text-[#6366f1]" />
                            Dashboard
                        </button>
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t border-white/5">
                    <div className="flex items-center justify-between gap-3 px-3 py-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#6366f1] flex items-center justify-center font-black text-xs text-white shadow-lg shadow-[#6366f1]/20">
                                {user.username[0].toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs font-bold truncate text-white">{user.username}</p>
                                <p className="text-[10px] text-[#64748b] font-bold">Standard Account</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="text-slate-500 hover:text-rose-400 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 bg-[#0f1117] overflow-y-auto">
                {/* Ambient Background Glows */}
                <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#6366f1]/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
                <div className="fixed bottom-0 left-64 w-[300px] h-[300px] bg-indigo-500/5 blur-[100px] rounded-full -ml-32 -mb-32 pointer-events-none" />

                {/* Sub-Header / Top Bar */}
                <div className="sticky top-0 z-20 bg-[#0f1117]/80 backdrop-blur-xl border-b border-white/5 px-12 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <span>Workspace</span>
                        <span className="text-white/10">/</span>
                        <span className="text-white">Active Dashboard</span>
                    </div>
                    
                    <div className="flex items-center gap-2">

                    </div>
                </div>

                <div className="px-12 py-12 w-full">
                    {/* Status Message */}
                    {!loading && (
                        <div className="mb-12">
                            <div className="inline-flex items-center px-5 py-2.5 bg-[#6366f1]/5 border border-[#6366f1]/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-[#6366f1]">
                                {analyzingId ? (
                                    <span className="flex items-center gap-2">
                                        <Brain className="w-4 h-4 animate-pulse" />
                                        Running AI Evaluation...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 text-slate-400">
                                        <Zap className="w-4 h-4 text-amber-500/50" />
                                        Ready • Select a vendor to start
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Global Error Notifications */}
                    {error && (
                        <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-6 mb-12 flex items-start gap-5">
                            <div className="bg-rose-500/20 p-2.5 rounded-xl">
                                <AlertCircle className="w-5 h-5 text-rose-500" />
                            </div>
                            <div>
                                <h3 className="text-rose-500 font-black text-xs uppercase tracking-widest">System Alert</h3>
                                <p className="text-rose-200/60 text-sm mt-1.5 font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    {!loading || contracts.length > 0 ? (
                        <div className="space-y-20">
                            {/* KPI Metrics */}
                            <section>
                                <h2 className="table-header">Performance Overview</h2>
                                <StatsCard contracts={evaluatedContracts} />
                            </section>

                            {/* Data Visuals */}
                            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div className="card group">
                                    <div className="flex items-center justify-between mb-10">
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Performance Trend</h3>
                                        <TrendingUp className="w-4 h-4 text-indigo-500/30 group-hover:text-indigo-400 transition-colors" />
                                    </div>
                                    <PerformanceChart contracts={evaluatedContracts} />
                                </div>
                                <div className="card group">
                                    <div className="flex items-center justify-between mb-10">
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Risk Distribution</h3>
                                        <ShieldCheck className="w-4 h-4 text-indigo-500/30 group-hover:text-indigo-400 transition-colors" />
                                    </div>
                                    <RiskHeatmap contracts={evaluatedContracts} />
                                </div>
                            </section>

                            {/* Data Grid */}
                            <section>
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="table-header mb-0 border-b-0">Contract Registry</h2>
                                    <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">{contracts.length} Records Loaded</span>
                                </div>
                                <ContractTable
                                    contracts={contracts}
                                    onSelectContract={handleSelectContract}
                                    selectedContractId={selectedContract?.contract_id}
                                    analyzingId={analyzingId}
                                />
                            </section>

                            {/* Analysis Report Section */}
                            <section className="pt-16 border-t border-white/5 scroll-mt-32" id="reasoning-report">
                                {selectedContract && selectedContract.status === 'completed' ? (
                                    <ReasoningChain
                                        reasoning={{
                                            vendor_name: selectedContract.vendor_name,
                                            reasoning_chain: selectedContract.reasoning_chain,
                                            confidence_level: selectedContract.confidence_level,
                                            justification: selectedContract.justification,
                                            recommendation: selectedContract.recommendation
                                        }}
                                        isAnalyzing={analyzingId === selectedContract.contract_id}
                                    />
                                ) : (
                                    <div className="card bg-white/[0.01] border-dashed border-white/10 py-24 text-center flex flex-col items-center">
                                        <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-[32px] flex items-center justify-center mb-8 shadow-2xl relative group overflow-hidden">
                                            <div className="absolute inset-0 bg-[#6366f1]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <Brain className="w-10 h-10 text-slate-700 relative z-10" />
                                        </div>
                                        <h3 className="text-white font-black uppercase text-xs tracking-[0.2em]">Evaluation Report</h3>
                                        <p className="text-slate-500 text-sm mt-4 max-w-xs mx-auto font-medium opacity-80">Select a vendor from the registry above to view the AI synthesis and report.</p>
                                    </div>
                                )}
                            </section>
                        </div>
                    ) : (
                        /* Loading State */
                        <div className="flex flex-col items-center justify-center py-48 text-center">
                            <div className="relative mb-10">
                                <div className="w-20 h-20 border-[3px] border-white/5 border-t-[#6366f1] rounded-[32px] animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <ShieldCheck className="w-8 h-8 text-[#6366f1]/20" />
                                </div>
                            </div>
                            <h3 className="text-white font-black uppercase text-xs tracking-[0.25em] mb-3">Syncing Environment</h3>
                            <p className="text-slate-500 text-sm font-medium opacity-80">Reconstructing your evaluation workspace...</p>
                        </div>
                    )}

                    {/* Footer / Copyright */}
                    <footer className="mt-40 pt-10 border-t border-white/5 flex items-center justify-between text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">
                        <p>© 2026 Contract Evaluation • Enterprise Edition</p>
                        <div className="flex gap-10">
                            <a href="#" className="hover:text-[#6366f1] transition-colors">Security Profile</a>
                            <a href="#" className="hover:text-[#6366f1] transition-colors">Privacy Charter</a>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
}

export default App;
