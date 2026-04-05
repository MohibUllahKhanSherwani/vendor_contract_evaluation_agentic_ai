import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const RiskHeatmap = ({ contracts }) => {
    // Count by risk level
    const riskCounts = {
        low: contracts.filter(c => (c.risk_level || '').toLowerCase() === 'low').length,
        medium: contracts.filter(c => (c.risk_level || '').toLowerCase() === 'medium' || (c.risk_level || '').toLowerCase() === 'monitor').length,
        high: contracts.filter(c => (c.risk_level || '').toLowerCase() === 'high').length,
    };

    const data = [
        { name: 'Low Risk', value: riskCounts.low, color: '#10b981' }, // Emerald 500
        { name: 'Monitor', value: riskCounts.medium, color: '#f59e0b' }, // Amber 500
        { name: 'High Risk', value: riskCounts.high, color: '#f43f5e' }, // Rose 500
    ].filter(item => item.value > 0);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const total = contracts.length;
            const percentage = ((data.value / total) * 100).toFixed(0);
            
            return (
                <div className="bg-[#111214] border border-white/10 rounded-xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 border-b border-white/5 pb-3">Risk Summary</p>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ backgroundColor: data.color }} />
                        <p className="font-black text-white text-base tracking-tight">{data.name}</p>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between gap-12">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Count</span>
                            <span className="text-sm font-black text-white">{data.value}</span>
                        </div>
                        <div className="flex items-center justify-between gap-12">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Percentage</span>
                            <span className="text-sm font-black text-accent">{percentage}%</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    if (contracts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-slate-600 text-xs font-bold uppercase tracking-widest italic opacity-60">No risk data yet</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={95}
                        paddingAngle={8}
                        stroke="rgba(0,0,0,0.3)"
                        strokeWidth={2}
                    >
                        {data.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color} 
                                className="hover:opacity-80 transition-all cursor-pointer outline-none"
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                        verticalAlign="bottom" 
                        height={40} 
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RiskHeatmap;
