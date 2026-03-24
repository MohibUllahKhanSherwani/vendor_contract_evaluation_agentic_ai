/**
 * Contract Overview Table Component
 * Displays all vendors - pending ones show "Click to Screen", evaluated ones show full data
 */
import { useState } from 'react';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

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
        let aVal = a[sortField];
        let bVal = b[sortField];

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
            <ChevronUp className="w-4 h-4 inline" /> :
            <ChevronDown className="w-4 h-4 inline" />;
    };

    const isPending = (contract) => contract.status === 'pending';
    const isAnalyzing = (contract) => analyzingId === contract.contract_id;

    return (
        <div className="card">
            <h2 className="text-2xl font-bold mb-6 text-white">Contract Evaluations</h2>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-700">
                            <th
                                className="text-left py-3 px-4 text-slate-300 font-semibold cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('vendor_name')}
                            >
                                Vendor <SortIcon field="vendor_name" />
                            </th>
                            <th
                                className="text-left py-3 px-4 text-slate-300 font-semibold cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('contract_id')}
                            >
                                Contract ID <SortIcon field="contract_id" />
                            </th>
                            <th
                                className="text-left py-3 px-4 text-slate-300 font-semibold cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('performance_score')}
                            >
                                Score <SortIcon field="performance_score" />
                            </th>
                            <th
                                className="text-left py-3 px-4 text-slate-300 font-semibold cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('grade')}
                            >
                                Grade <SortIcon field="grade" />
                            </th>
                            <th
                                className="text-left py-3 px-4 text-slate-300 font-semibold cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('risk_level')}
                            >
                                Risk <SortIcon field="risk_level" />
                            </th>
                            <th
                                className="text-left py-3 px-4 text-slate-300 font-semibold cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('recommendation')}
                            >
                                Recommendation <SortIcon field="recommendation" />
                            </th>
                            <th className="text-left py-3 px-4 text-slate-300 font-semibold">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedContracts.map((contract, idx) => (
                            <tr
                                key={contract.contract_id || idx}
                                className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors cursor-pointer ${
                                    selectedContractId === contract.contract_id ? 'bg-slate-700/40' : ''
                                } ${isAnalyzing(contract) ? 'animate-pulse' : ''}`}
                                onClick={() => onSelectContract && onSelectContract(contract)}
                            >
                                <td className="py-4 px-4 text-white font-medium">
                                    {contract.vendor_name || 'Unknown'}
                                </td>
                                <td className="py-4 px-4 text-slate-400 font-mono text-sm">
                                    {contract.contract_id || 'N/A'}
                                </td>

                                {/* Score */}
                                <td className="py-4 px-4">
                                    {isPending(contract) ? (
                                        <span className="text-slate-500 text-sm">—</span>
                                    ) : (
                                        <>
                                            <span className="text-2xl font-bold text-white">
                                                {parseFloat(contract.performance_score || 0).toFixed(1)}
                                            </span>
                                            <span className="text-slate-400">/100</span>
                                        </>
                                    )}
                                </td>

                                {/* Grade */}
                                <td className="py-4 px-4">
                                    {isPending(contract) ? (
                                        <span className="text-slate-500 text-sm">—</span>
                                    ) : (
                                        <span className={`text-xl font-bold ${contract.grade === 'A' ? 'text-green-400' :
                                                contract.grade === 'B' ? 'text-blue-400' :
                                                    contract.grade === 'C' ? 'text-yellow-400' :
                                                        contract.grade === 'D' ? 'text-orange-400' :
                                                            'text-red-400'
                                            }`}>
                                            {contract.grade || '—'}
                                        </span>
                                    )}
                                </td>

                                {/* Risk */}
                                <td className="py-4 px-4">
                                    {isPending(contract) ? (
                                        <span className="text-slate-500 text-sm">—</span>
                                    ) : (
                                        <span className={`badge ${getRiskBadgeClass(contract.risk_level)}`}>
                                            {(contract.risk_level || 'UNKNOWN').toUpperCase()}
                                        </span>
                                    )}
                                </td>

                                {/* Recommendation */}
                                <td className="py-4 px-4">
                                    {isPending(contract) ? (
                                        <span className="text-slate-500 text-sm">—</span>
                                    ) : (
                                        <span className={`font-semibold ${contract.recommendation === 'RENEW' ? 'text-green-400' :
                                                contract.recommendation === 'MONITOR' ? 'text-blue-400' :
                                                    contract.recommendation === 'RENEGOTIATE' ? 'text-yellow-400' :
                                                        contract.recommendation === 'TERMINATE' ? 'text-red-400' :
                                                            'text-slate-400'
                                            }`}>
                                            {contract.recommendation || '—'}
                                        </span>
                                    )}
                                </td>

                                {/* Status */}
                                <td className="py-4 px-4">
                                    {isAnalyzing(contract) ? (
                                        <span className="flex items-center gap-2 text-sm text-daleel-400">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Screening...
                                        </span>
                                    ) : isPending(contract) ? (
                                        <span className="text-sm px-2 py-1 rounded bg-slate-500/20 text-slate-400">
                                            Click to screen
                                        </span>
                                    ) : (
                                        <span className={`text-sm px-2 py-1 rounded ${contract.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                                contract.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-slate-500/20 text-slate-400'
                                            }`}>
                                            {contract.status || 'unknown'}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {contracts.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    No vendors found
                </div>
            )}
        </div>
    );
};

export default ContractTable;
