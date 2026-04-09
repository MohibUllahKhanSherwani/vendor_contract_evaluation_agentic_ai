import React, { useState } from 'react';
import { Database, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const ConnectDataModal = ({ isOpen, onClose, onConnect }) => {
    const [sourceType, setSourceType] = useState('mongo');
    const [mongoUri, setMongoUri] = useState('');
    const [dbName, setDbName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSaving(true);
        
        try {
            await onConnect(sourceType, mongoUri, dbName);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-[#1a1f2e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-500/20 p-2 rounded-lg">
                            <Database className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h2 className="text-white font-bold text-lg leading-none">Connect Your Data</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-sm text-slate-400 mb-6">
                        Configure the data source for your evaluated contracts. Connect your own MongoDB cluster or use the default local files.
                    </p>

                    {error && (
                        <div className="mb-6 bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-rose-200">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                                Data Source Type
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setSourceType('mongo')}
                                    className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                                        sourceType === 'mongo' 
                                        ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' 
                                        : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                                    }`}
                                >
                                    {sourceType === 'mongo' && <CheckCircle className="w-4 h-4" />}
                                    MongoDB Server
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSourceType('local')}
                                    className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                                        sourceType === 'local' 
                                        ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' 
                                        : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                                    }`}
                                >
                                    {sourceType === 'local' && <CheckCircle className="w-4 h-4" />}
                                    Local JSON Files
                                </button>
                            </div>
                        </div>

                        {sourceType === 'mongo' && (
                            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                                        MongoDB Connection URI
                                    </label>
                                    <input 
                                        type="text" 
                                        value={mongoUri}
                                        onChange={(e) => setMongoUri(e.target.value)}
                                        placeholder="mongodb+srv://<user>:<pass>@cluster.mongodb.net/?appName=app"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                                        required={sourceType === 'mongo'}
                                    />
                                    <p className="text-[11px] text-slate-500 mt-1.5 font-medium">Paste your full MongoDB connection string including credentials.</p>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                                        Database Name
                                    </label>
                                    <input 
                                        type="text" 
                                        value={dbName}
                                        onChange={(e) => setDbName(e.target.value)}
                                        placeholder="Enter your database or cluster name"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                                        required={sourceType === 'mongo'}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="pt-4 flex items-center justify-end gap-3 mt-8 border-t border-white/5">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm font-bold text-slate-300 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Connecting...
                                    </>
                                ) : (
                                    'Connect & Refresh'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ConnectDataModal;
