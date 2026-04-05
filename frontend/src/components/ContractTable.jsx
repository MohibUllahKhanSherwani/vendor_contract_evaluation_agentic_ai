import { useState } from 'react';
import { ChevronDown, ChevronUp, Loader2, AlertCircle, Play } from 'lucide-react';

const ContractTable = ({ contracts, onSelectContract, selectedContractId, analyzingId }) => {
    const [sortField, setSortField] = useState('vendor_name');
    const [sortDirection, setSortDirection] = useState('asc');

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const sortedContracts = [...contracts].sort((a, b) => {
        let aVal = a[sortField] || '';
        let bVal = b[sortField] || '';

        if (sortField === 'performance_score') {
            aVal = parseFloat(aVal) || 0;
            bVal = parseFloat(bVal) || 0;
        }

        if (sortDirection === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    const getRiskBadgeClass = (risk) => {
        const riskLower = (risk || '').toLowerCase();
        if (riskLower === 'low') return 'badge-low';
        if (riskLower === 'medium') return 'badge-medium';
        if (riskLower === 'high') return 'badge-high';
        return 'badge-medium';
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ?
            <ChevronUp className="w-3 h-3 inline ml-1 text-[#6366f1]" /> :
            <ChevronDown className="w-3 h-3 inline ml-1 text-[#6366f1]" />;
    };

    const isPending = (contract) => contract.status === 'pending';
    const isAnalyzing = (contract) => analyzingId === contract.contract_id;

    return (
        <div className="card !p-0 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01]">
                            {[
                                { id: 'vendor_name', label: 'Vendor' },
                                { id: 'contract_id', label: 'Contract ID' },
                                { id: 'performance_score', label: 'Score' },
                                { id: 'grade', label: 'Grade' },
                                { id: 'risk_level', label: 'Risk' },
                                { id: 'recommendation', label: 'Recommendation' },
                                { id: 'status', label: 'Status' }
                            ].map((col) => (
                                <th
                                    key={col.id}
                                    className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.25em] text-[#64748b] cursor-pointer hover:text-white transition-colors"
                                    onClick={() => handleSort(col.id)}
                                >
                                    <div className="flex items-center">
                                        {col.label}
                                        <SortIcon field={col.id} />
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {sortedContracts.map((contract, idx) => (
                            <tr
                                key={contract.contract_id || idx}
                                className={`group hover:bg-white/[0.02] transition-all cursor-pointer ${
                                    selectedContractId === contract.contract_id ? 'bg-[#6366f1]/5' : 'bg-transparent'
                                } ${isAnalyzing(contract) ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                                onClick={() => onSelectContract && onSelectContract(contract)}
                            >
                                <td className="py-5 px-6">
                                    <div className="font-bold text-slate-200 group-hover:text-white transition-colors">{contract.vendor_name || 'Unidentified Entity'}</div>
                                </td>
                                <td className="py-5 px-6">
                                    <div className="font-mono text-[10px] text-[#64748b] font-bold tracking-wider">{contract.contract_id || 'X-000-00'}</div>
                                </td>

                                {/* Score */}
                                <td className="py-5 px-6">
                                    {isPending(contract) ? (
                                        <div className="w-6 h-0.5 bg-white/5 rounded-full" />
                                    ) : (
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-lg font-black text-white">
                                                {parseFloat(contract.performance_score || 0).toFixed(0)}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-600">/ 100</span>
                                        </div>
                                    )}
                                </td>

                                {/* Grade */}
                                <td className="py-5 px-6">
                                    {isPending(contract) ? (
                                        <div className="w-6 h-0.5 bg-white/5 rounded-full" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                                            <span className={`text-sm font-black ${
                                                contract.grade === 'A' ? 'text-emerald-400' :
                                                contract.grade === 'B' ? 'text-[#6366f1]' :
                                                contract.grade === 'C' ? 'text-amber-400' :
                                                'text-rose-400'
                                            }`}>
                                                {contract.grade || '—'}
                                            </span>
                                        </div>
                                    )}
                                </td>

                                {/* Risk */}
                                <td className="py-5 px-6">
                                    {isPending(contract) ? (
                                        <div className="w-6 h-0.5 bg-white/5 rounded-full" />
                                    ) : (
                                        <span className={`badge ${getRiskBadgeClass(contract.risk_level)}`}>
                                            {contract.risk_level}
                                        </span>
                                    )}
                                </td>

                                {/* Recommendation */}
                                <td className="py-5 px-6 text-center">
                                    {isPending(contract) ? (
                                        <div className="w-6 h-0.5 bg-white/5 rounded-full mx-auto" />
                                    ) : (
                                        <span className={`text-[10px] font-black tracking-[0.15em] uppercase px-3 py-1 bg-white/[0.03] border border-white/5 rounded-lg ${
                                            contract.recommendation === 'RENEW' ? 'text-emerald-400' :
                                            contract.recommendation === 'MONITOR' ? 'text-[#6366f1]' :
                                            contract.recommendation === 'RENEGOTIATE' ? 'text-amber-400' :
                                            'text-rose-400'
                                        }`}>
                                            {contract.recommendation}
                                        </span>
                                    )}
                                </td>

                                {/* Status */}
                                <td className="py-5 px-6">
                                    {isAnalyzing(contract) ? (
                                        <div className="flex items-center gap-2 text-[9px] font-black text-[#6366f1] bg-[#6366f1]/10 border border-[#6366f1]/20 px-3 py-1.5 rounded-lg tracking-widest">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            ANALYZING
                                        </div>
                                    ) : isPending(contract) ? (
                                        <button 
                                            title="Trigger AI Evaluation"
                                            className="btn-ghost-sim group/btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelectContract && onSelectContract(contract);
                                            }}
                                        >
                                            <Play className="w-3 h-3 fill-[#6366f1] text-[#6366f1] group-hover/btn:scale-110 transition-transform" />
                                            Run Eval
                                        </button>
                                    ) : (
                                        <div className={`text-[9px] font-black px-3 py-1.5 rounded-lg inline-block border tracking-widest ${
                                            contract.status === 'completed' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' :
                                            contract.status === 'failed' ? 'bg-rose-500/5 text-rose-400 border-rose-500/10' :
                                            'bg-slate-800/10 text-[#64748b] border-white/5'
                                        }`}>
                                            {(contract.status || 'READY').toUpperCase()}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {contracts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                    <div className="w-16 h-16 bg-white/[0.01] border border-white/5 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
                        <AlertCircle className="w-8 h-8 text-slate-700" />
                    </div>
                    <h3 className="text-white font-black uppercase text-xs tracking-widest">Registry Empty</h3>
                    <p className="text-slate-500 text-sm mt-3 max-w-xs font-medium">Re-initialize the hub to populate the contract workspace.</p>
                </div>
            )}
        </div>
    );
};

export default ContractTable;
