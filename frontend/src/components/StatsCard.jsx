import { Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const StatsCard = ({ contracts }) => {
    const total = contracts.length;
    const lowRisk = contracts.filter(c => (c.risk_level || '').toLowerCase() === 'low').length;
    const mediumRisk = contracts.filter(c => (c.risk_level || '').toLowerCase() === 'medium').length;
    const highRisk = contracts.filter(c => (c.risk_level || '').toLowerCase() === 'high').length;

    const stats = [
        {
            label: 'Total Reports',
            value: total,
            icon: Activity,
            color: 'text-white',
            borderColor: 'border-white/10',
            glowColor: 'bg-white/5'
        },
        {
            label: 'Low Risk',
            value: lowRisk,
            icon: CheckCircle,
            color: 'text-emerald-400',
            borderColor: 'border-emerald-500/20',
            glowColor: 'bg-emerald-500/10'
        },
        {
            label: 'Monitor',
            value: mediumRisk,
            icon: AlertTriangle,
            color: 'text-amber-400',
            borderColor: 'border-amber-500/20',
            glowColor: 'bg-amber-500/10'
        },
        {
            label: 'High Alert',
            value: highRisk,
            icon: XCircle,
            color: 'text-rose-400',
            borderColor: 'border-rose-500/20',
            glowColor: 'bg-rose-500/10'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                    <div key={idx} className="card group hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                        <div className="flex items-center gap-5">
                            <div className={`${stat.glowColor} ${stat.borderColor} border p-3 rounded-2xl transition-all group-hover:brightness-125 duration-500 shadow-2xl`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                    {stat.label}
                                </p>
                                <p className="text-2xl font-black text-white leading-none tracking-tight">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StatsCard;
