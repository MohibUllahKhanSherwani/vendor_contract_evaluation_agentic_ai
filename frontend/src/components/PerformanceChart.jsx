import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const PerformanceChart = ({ contracts }) => {
    const chartData = contracts.map(contract => ({
        name: contract.vendor_name || 'Unknown',
        score: parseFloat(contract.performance_score || 0),
        grade: contract.grade || 'F',
        risk: (contract.risk_level || 'unknown').toLowerCase()
    }));

    const getBarColor = (risk) => {
        if (risk === 'low') return '#10b981'; // Emerald 500
        if (risk === 'medium' || risk === 'monitor') return '#f59e0b'; // Amber 500
        if (risk === 'high') return '#f43f5e'; // Rose 500
        return '#5e6ad2'; // Linear Accent
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-[#111214] border border-white/10 rounded-xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 border-b border-white/5 pb-3">Performance Details</p>
                    <p className="font-black text-white text-base mb-4 tracking-tight">{data.name}</p>
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-10">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Score</span>
                            <span className="text-sm font-black text-accent">{data.score}/100</span>
                        </div>
                        <div className="flex items-center justify-between gap-10">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Grade</span>
                            <span className="text-sm font-black text-white">{data.grade}</span>
                        </div>
                        <div className="flex items-center justify-between  gap-10">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Risk Level</span>
                            <span className={`text-[11px] font-black uppercase tracking-widest ${
                                data.risk === 'low' ? 'text-emerald-400' :
                                data.risk === 'high' ? 'text-rose-400' :
                                'text-amber-400'
                            }`}>{data.risk}</span>
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
                <p className="text-slate-600 text-xs font-bold uppercase tracking-widest italic opacity-60">No performance data yet</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="name"
                        stroke="#4b4e54"
                        tick={{ fill: '#4b4e54', fontSize: 9, fontWeight: 800 }}
                        axisLine={false}
                        tickLine={false}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis
                        stroke="#4b4e54"
                        tick={{ fill: '#4b4e54', fontSize: 9, fontWeight: 800 }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 100]}
                        tickCount={5}
                    />
                    <Tooltip 
                        content={<CustomTooltip />} 
                        cursor={{ fill: 'rgba(255,255,255,0.02)' }} 
                    />
                    <Bar dataKey="score" name="Performance" radius={[4, 4, 4, 4]} barSize={24}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(entry.risk)} className="hover:brightness-125 transition-all cursor-pointer" />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PerformanceChart;
