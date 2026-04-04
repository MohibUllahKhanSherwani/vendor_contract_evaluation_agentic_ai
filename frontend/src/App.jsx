import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, Zap, Brain, TrendingUp, ShieldCheck, LogOut, User as UserIcon } from 'lucide-react';
import ContractTable from './components/ContractTable';
import StatsCard from './components/StatsCard';
import PerformanceChart from './components/PerformanceChart';
import RiskHeatmap from './components/RiskHeatmap';
import ReasoningChain from './components/ReasoningChain';
import Auth from './components/Auth';
import { fetchVendors, evaluateSample } from './services/api';

function App() {
    const [user, setUser] = useState(null);
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analyzingId, setAnalyzingId] = useState(null);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [selectedContract, setSelectedContract] = useState(null);

    /**
     * Load vendors from backend
     */
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

    /**
     * TRIGGER AI SCREENING ON VENDOR CLICK
     */
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

    // Load vendors when user logs in
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
        return <Auth onAuthSuccess={setUser} />;
    }

    const evaluatedContracts = contracts.filter(c => c.status === 'completed');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
            {/* Header */}
            <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-20">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-brand-500 p-1.5 rounded-lg">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white tracking-tight">Contract Intelligence</h1>
                                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Contract Intelligence Hub</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                                <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400">
                                    <UserIcon className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter leading-none">Authenticated As</p>
                                    <p className="text-white text-sm font-semibold">{user.username}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={loadVendors}
                                    disabled={loading || analyzingId}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all disabled:opacity-30"
                                    title="Refresh data"
                                >
                                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-medium text-sm border border-transparent hover:border-red-400/20"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8">
                {/* Indicator Strip */}
                {!loading && (
                    <div className="mb-6">
                        <div className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-400 text-xs font-mono inline-block">
                            {analyzingId ? (
                                <span className="flex items-center gap-2">
                                    <Brain className="w-3 h-3 text-brand-400 animate-pulse" />
                                    Screening in progress...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-yellow-400" />
                                    Ready for AI screening • Click any vendor in the table below
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-red-400 font-semibold">System Alert</h3>
                            <p className="text-red-300 text-sm mt-1">{error}</p>
                        </div>
                    </div>
                )}

                {/* Dashboard Grid */}
                {!loading || contracts.length > 0 ? (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <StatsCard contracts={evaluatedContracts} />

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <PerformanceChart contracts={evaluatedContracts} />
                            <RiskHeatmap contracts={evaluatedContracts} />
                        </div>

                        {/* Contracts Table */}
                        <ContractTable
                            contracts={contracts}
                            onSelectContract={handleSelectContract}
                            selectedContractId={selectedContract?.contract_id}
                            analyzingId={analyzingId}
                        />

                        {/* Reasoning Detail View */}
                        <div className="pt-4 scroll-mt-24" id="reasoning-report">
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
                                <div className="bg-slate-800/30 rounded-3xl border border-dashed border-slate-700/50 text-center py-12">
                                    <TrendingUp className="w-10 h-10 text-slate-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-slate-400">No Intelligence Report Selected</h3>
                                    <p className="text-slate-500 text-sm">Select a processed vendor to view deep-dive AI reasoning</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    loading && (
                        <div className="text-center py-40">
                            <div className="relative inline-block">
                                <div className="w-16 h-16 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
                                <ShieldCheck className="w-6 h-6 text-brand-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <p className="text-slate-400 mt-6 font-medium">Fetching Intelligence Reports...</p>
                        </div>
                    )
                )}
            </main>
        </div>
    );
}

export default App;
