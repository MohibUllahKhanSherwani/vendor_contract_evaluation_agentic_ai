import { useState } from 'react';
import { ShieldCheck, User, Mail, Lock, LogIn, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { login, register } from '../services/api';

const Auth = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let response;
            if (isLogin) {
                response = await login(formData.email, formData.password);
            } else {
                response = await register(formData.username, formData.email, formData.password);
            }

            if (response.success) {
                onAuthSuccess({ 
                    ...(response.user || { username: formData.username, email: formData.email }), 
                    isNewUser: !isLogin 
                });
            } else {
                setError(response.message || 'Authentication failed');
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0f1117] relative overflow-hidden">
            {/* Ambient Ambient Glows */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#6366f1]/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-500/5 blur-[100px] rounded-full -ml-32 -mb-32 pointer-events-none" />

            <div className="w-full max-w-sm relative z-10 animate-in fade-in zoom-in-95 duration-700">
                {/* Logo & Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex bg-[#6366f1] p-3 rounded-[32px] shadow-2xl mb-8 group transition-all hover:scale-110 border border-white/5">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight leading-none">Evaluation Hub</h1>
                    <p className="text-slate-500 text-sm mt-4 font-bold uppercase tracking-widest opacity-80">AI-Powered Contract Synth</p>
                </div>

                {/* Main Auth Card */}
                <div className="card !p-8 bg-[#1a1f2e] border-white/5 relative overflow-hidden shadow-2xl shadow-black/50">
                    {/* Top Switcher */}
                    <div className="flex bg-black/20 p-1 rounded-2xl mb-8 border border-white/5">
                        <button 
                            type="button"
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isLogin ? 'bg-white/5 text-white border border-white/10 shadow-lg' : 'text-slate-500 hover:text-white'}`}
                        >
                            Login
                        </button>
                        <button 
                            type="button"
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isLogin ? 'bg-white/5 text-white border border-white/10 shadow-lg' : 'text-slate-500 hover:text-white'}`}
                        >
                            Register
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                                <p className="text-rose-200/70 text-[10px] font-black leading-relaxed tracking-wide uppercase">{error}</p>
                            </div>
                        )}

                        {!isLogin && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-left-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#6366f1] transition-colors" />
                                    <input 
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        className="input pl-11"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#6366f1] transition-colors" />
                                <input 
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@company.com"
                                    className="input pl-11"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#6366f1] transition-colors" />
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="input pl-11 pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`btn-primary w-full mt-6 h-12 shadow-2xl relative group overflow-hidden`}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span className="uppercase tracking-[0.2em] text-[10px] font-black relative z-10">{isLogin ? 'Login' : 'Register'}</span>
                                    <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
                
                <p className="text-center mt-12 text-slate-700 text-[9px] font-black uppercase tracking-[0.3em]">
                    Enterprise Security Layer Active
                </p>

                <p className="text-center mt-10 text-[#64748b] text-xs font-bold">
                    {isLogin ? "New to the platform?" : "Joined us before?"}
                    <button 
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-2 text-white font-black hover:text-[#6366f1] transition-colors underline decoration-[#6366f1]/30 underline-offset-8"
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Auth;
