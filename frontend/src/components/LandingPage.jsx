import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    ShieldCheck, ArrowRight, ChevronRight, Database, Brain, TrendingUp,
    AlertTriangle, FileSearch, Zap, BarChart3, Target, Clock, DollarSign,
    Layers, GitMerge, Award, ArrowUpRight, Menu, X
} from 'lucide-react';

/* ─────────────────────────────────────────────
   HOOK: Intersection Observer for scroll anims
   ───────────────────────────────────────────── */
const useInView = (options = {}) => {
    const ref = useRef(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                observer.unobserve(el);
            }
        }, { threshold: 0.15, ...options });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return [ref, isInView];
};

/* ─────────────────────────────────────────────
   HOOK: Animated counter
   ───────────────────────────────────────────── */
const useCounter = (end, duration = 2000, start = 0, isActive = false) => {
    const [value, setValue] = useState(start);
    useEffect(() => {
        if (!isActive) return;
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            setValue(Math.floor(eased * (end - start) + start));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [isActive, end, duration, start]);
    return value;
};

/* ─────────────────────────────────────────────
   COMPONENT: Animated Stat Card
   ───────────────────────────────────────────── */
const StatCard = ({ icon: Icon, value, suffix, label, source, color, delay, isVisible }) => {
    const count = useCounter(parseFloat(value), 2200, 0, isVisible);
    return (
        <div
            className={`relative group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 hover:border-white/10 hover:bg-white/[0.05] transition-all duration-300 h-full">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                        {count}
                    </span>
                    <span className="text-2xl font-bold text-white/60">{suffix}</span>
                </div>
                <p className="text-sm font-bold text-slate-400 mb-4 leading-relaxed">{label}</p>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{source}</p>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   COMPONENT: Feature Section (alternating)
   ───────────────────────────────────────────── */
const FeatureSection = ({ title, subtitle, description, image, imageAlt, reversed, accentColor, index }) => {
    const [ref, isInView] = useInView();

    return (
        <div ref={ref} className="landing-feature-section">
            <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}>
                {/* Image Side */}
                <div className={`w-full lg:w-[55%] transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                     style={{ transitionDelay: '200ms' }}
                >
                    <div className="relative group">
                        {/* Ambient glow behind image */}
                        <div className={`absolute inset-0 ${accentColor} blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity duration-700 scale-90`} />
                        {/* Image container */}
                        <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_40px_80px_rgba(0,0,0,0.5)]
                                        group-hover:border-white/[0.12] group-hover:shadow-[0_50px_100px_rgba(0,0,0,0.6)]
                                        transition-all duration-500 group-hover:-translate-y-1">
                            <img
                                src={image}
                                alt={imageAlt}
                                className="w-full h-auto block"
                                loading="lazy"
                            />
                            {/* Subtle top reflection */}
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        </div>
                    </div>
                </div>

                {/* Text Side */}
                <div className={`w-full lg:w-[45%] transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                     style={{ transitionDelay: '400ms' }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] mb-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Feature {String(index).padStart(2, '0')}</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-[1.1] mb-4">
                        {title}
                    </h3>
                    <p className="text-base font-bold text-[#6366f1] mb-4">{subtitle}</p>
                    <p className="text-slate-400 leading-relaxed text-[15px] font-medium">{description}</p>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   COMPONENT: Pipeline Step
   ───────────────────────────────────────────── */
const PipelineStep = ({ icon: Icon, step, title, description, isVisible, delay, isLast }) => (
    <div className={`flex-1 relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
         style={{ transitionDelay: `${delay}ms` }}
    >
        <div className="flex flex-col items-center text-center group">
            <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center
                                group-hover:bg-[#6366f1]/20 group-hover:border-[#6366f1]/40 transition-all duration-300 group-hover:scale-110">
                    <Icon className="w-7 h-7 text-[#6366f1]" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#6366f1] flex items-center justify-center">
                    <span className="text-[10px] font-black text-white">{step}</span>
                </div>
            </div>
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-3">{title}</h4>
            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[200px]">{description}</p>
        </div>
        {/* Connector line */}
        {!isLast && (
            <div className="hidden lg:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px">
                <div className={`h-full bg-gradient-to-r from-[#6366f1]/40 to-[#6366f1]/10 transition-all duration-1000 ${isVisible ? 'scale-x-100' : 'scale-x-0'} origin-left`}
                     style={{ transitionDelay: `${delay + 300}ms` }}
                />
            </div>
        )}
    </div>
);

/* ═════════════════════════════════════════════
   MAIN COMPONENT: LandingPage
   ═════════════════════════════════════════════ */
const LandingPage = ({ onLogin, onSignUp }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [statsRef, statsInView] = useInView();
    const [pipelineRef, pipelineInView] = useInView();
    const [ctaRef, ctaInView] = useInView();
    const [heroRef, heroInView] = useInView({ threshold: 0.05 });
    const [problemRef, problemInView] = useInView();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollTo = useCallback((id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMobileMenu(false);
    }, []);

    const stats = [
        { icon: DollarSign, value: '9', suffix: '.2%', label: 'Average contract value lost annually from poor management', source: 'WorldCC Research', color: 'bg-rose-500/20 text-rose-400' },
        { icon: Clock, value: '92', suffix: ' min', label: 'Time spent per single manual contract review', source: 'WorldCC / ContractSafe', color: 'bg-amber-500/20 text-amber-400' },
        { icon: AlertTriangle, value: '78', suffix: '%', label: 'Of companies don\'t track obligations post-signing', source: 'WorldCC', color: 'bg-orange-500/20 text-orange-400' },
        { icon: Database, value: '24', suffix: '+', label: 'Systems where contract data lives on average', source: 'WorldCC Research', color: 'bg-sky-500/20 text-sky-400' },
    ];

    const features = [
        {
            title: 'Complete Performance Visibility',
            subtitle: 'Every KPI. Every Trend. One Dashboard.',
            description: 'Track vendor performance scores, risk distribution, and trend analysis in real-time. The performance overview consolidates uptime, SLA compliance, and customer satisfaction into a single, actionable view — no spreadsheet gymnastics required.',
            image: '/image.png',
            imageAlt: 'Dashboard showing performance overview with KPI cards, trend charts, and risk distribution',
            accentColor: 'bg-[#6366f1]',
        },
        {
            title: 'Every Vendor. Every Contract. Graded.',
            subtitle: 'AI-Assigned Grades from A to F.',
            description: 'The Contract Registry gives you a complete view of every vendor with their AI-computed performance score, risk level, and strategic recommendation — Renew, Monitor, Renegotiate, or Terminate. Click any row to trigger a full evaluation.',
            image: '/image_2.png',
            imageAlt: 'Contract registry table showing vendor grades, risk levels, and strategic recommendations',
            accentColor: 'bg-emerald-500',
        },
        {
            title: 'Transparent AI Reasoning',
            subtitle: 'No Black Boxes. Full Evidence Chain.',
            description: 'Every recommendation is backed by a detailed Logic Flow Pathway that cites exact figures — uptime percentages, incident counts, response times — from the raw data. See precisely why the AI reached its conclusion with full auditability.',
            image: '/image_3.png',
            imageAlt: 'AI reasoning chain showing logic flow pathway with evidence-based analysis steps',
            accentColor: 'bg-violet-500',
        },
        {
            title: 'Actionable Decisions, Not More Reports',
            subtitle: 'Renew. Monitor. Terminate. Done.',
            description: 'The Executive Summary distills weeks of manual analysis into a clear strategic outcome with a confidence rating. Management gets the "what to do" and the "why" in one glance, backed by multi-source AI synthesis.',
            image: '/image_4.png',
            imageAlt: 'Executive summary showing strategic outcome, recommendation, and detailed justification',
            accentColor: 'bg-teal-500',
        },
    ];

    const pipelineSteps = [
        { icon: Layers, step: 1, title: 'Ingest', description: 'Load vendor data from structured and unstructured sources automatically' },
        { icon: FileSearch, step: 2, title: 'Analyze', description: 'Specialized agents score KPIs and identify systemic risks' },
        { icon: GitMerge, step: 3, title: 'Synthesize', description: 'Reasoning engine weighs metrics against reviews and benchmarks' },
        { icon: Award, step: 4, title: 'Decide', description: 'Produces an overall grade, recommendation, and full justification' },
    ];

    return (
        <div className="landing-root">
            {/* ─── NAVIGATION ─── */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0f1117]/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/20' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="bg-[#6366f1] p-1.5 rounded-lg shadow-lg shadow-[#6366f1]/20">
                            <ShieldCheck className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-black tracking-tight text-white">Contract Evaluations</span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <button onClick={() => scrollTo('problem')} className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest cursor-pointer">Problem</button>
                        <button onClick={() => scrollTo('features')} className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest cursor-pointer">Features</button>
                        <button onClick={() => scrollTo('how-it-works')} className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest cursor-pointer">How It Works</button>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <button onClick={onLogin} className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest px-4 py-2 cursor-pointer">
                            Login
                        </button>
                        <button onClick={onSignUp} className="text-xs font-black text-black bg-white hover:bg-slate-100 px-5 py-2.5 rounded-xl uppercase tracking-widest transition-all active:scale-95 shadow-lg cursor-pointer">
                            Get Started
                        </button>
                    </div>

                    {/* Mobile menu toggle */}
                    <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-white cursor-pointer">
                        {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenu && (
                    <div className="md:hidden bg-[#0f1117]/95 backdrop-blur-2xl border-t border-white/5 px-6 py-6 space-y-4 animate-in slide-in-from-top-2">
                        <button onClick={() => scrollTo('problem')} className="block text-sm font-bold text-slate-400 hover:text-white cursor-pointer">Problem</button>
                        <button onClick={() => scrollTo('features')} className="block text-sm font-bold text-slate-400 hover:text-white cursor-pointer">Features</button>
                        <button onClick={() => scrollTo('how-it-works')} className="block text-sm font-bold text-slate-400 hover:text-white cursor-pointer">How It Works</button>
                        <hr className="border-white/5" />
                        <button onClick={onLogin} className="block text-sm font-bold text-slate-400 hover:text-white cursor-pointer">Login</button>
                        <button onClick={onSignUp} className="block w-full text-xs font-black text-black bg-white hover:bg-slate-100 px-5 py-3 rounded-xl uppercase tracking-widest cursor-pointer">Get Started</button>
                    </div>
                )}
            </nav>

            {/* ─── HERO SECTION ─── */}
            <section ref={heroRef} className="relative min-h-screen flex items-center pt-16 overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#6366f1]/8 blur-[120px] rounded-full -mt-32" />
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[100px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32 relative z-10 w-full">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
                        {/* Hero Text */}
                        <div className={`lg:w-[45%] transition-all duration-1000 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/20 mb-8">
                                <Zap className="w-3.5 h-3.5 text-[#6366f1]" />
                                <span className="text-[11px] font-black text-[#6366f1] uppercase tracking-widest">AI-Powered Evaluation</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[0.95] mb-6">
                                Stop Guessing.
                                <br />
                                <span className="bg-gradient-to-r from-[#6366f1] to-violet-400 bg-clip-text text-transparent">Start Knowing.</span>
                            </h1>

                            <p className="text-lg text-slate-400 leading-relaxed font-medium mb-10 max-w-lg">
                                An autonomous AI agent that replaces hours of manual vendor contract evaluation with objective, evidence-backed decisions — in seconds.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={onSignUp}
                                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-2xl
                                               hover:bg-slate-100 active:scale-95 transition-all shadow-2xl shadow-white/10 cursor-pointer">
                                    Get Started Free
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button onClick={() => scrollTo('features')}
                                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/5 text-white text-xs font-black uppercase tracking-widest rounded-2xl
                                               border border-white/10 hover:bg-white/10 active:scale-95 transition-all cursor-pointer">
                                    See How It Works
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className={`lg:w-[55%] transition-all duration-1000 delay-300 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                            <div className="relative group">
                                {/* Ambient glow */}
                                <div className="absolute inset-0 bg-[#6366f1] blur-[80px] opacity-15 group-hover:opacity-25 transition-opacity duration-700 scale-90 rounded-3xl" />
                                {/* Image */}
                                <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]
                                                shadow-[0_60px_120px_rgba(0,0,0,0.6)] group-hover:shadow-[0_70px_140px_rgba(0,0,0,0.7)]
                                                transition-all duration-500 group-hover:-translate-y-2
                                                transform perspective-[2000px] rotate-y-[-2deg] rotate-x-[2deg]">
                                    <img src="/image.png" alt="Contract Evaluations Dashboard" className="w-full h-auto block" />
                                    {/* Top reflection line */}
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── PROBLEM / DATA SILOS ─── */}
            <section id="problem" ref={problemRef} className="relative py-32 overflow-hidden">
                {/* Background image with overlay */}
                <div className="absolute inset-0">
                    <img src="/data_silos.png" alt="" className="w-full h-full object-cover opacity-[0.07]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0f1117] via-[#0f1117]/90 to-[#0f1117]" />
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className={`text-center max-w-3xl mx-auto mb-20 transition-all duration-1000 ${problemInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 mb-8">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                            <span className="text-[11px] font-black text-rose-400 uppercase tracking-widest">The Problem</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[0.95] mb-6">
                            Your Contract Data
                            <br />
                            <span className="text-slate-500">Is Trapped.</span>
                        </h2>
                        <p className="text-lg text-slate-400 font-medium leading-relaxed">
                            Evaluation data is scattered across spreadsheets, emails, and siloed systems. Manual reviews are slow, subjective, and impossible to audit. Here's what the research says:
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                            <StatCard key={i} {...stat} delay={i * 150} isVisible={statsInView} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FEATURES (Alternating Sections) ─── */}
            <section id="features" className="py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center max-w-3xl mx-auto mb-24">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/20 mb-8">
                            <BarChart3 className="w-3.5 h-3.5 text-[#6366f1]" />
                            <span className="text-[11px] font-black text-[#6366f1] uppercase tracking-widest">Platform Features</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-[0.95] mb-6">
                            Built for Contract
                            <br />Intelligence
                        </h2>
                        <p className="text-lg text-slate-400 font-medium leading-relaxed">
                            Four specialized AI agents work together to deliver a 360-degree vendor evaluation — from raw data to executive decision.
                        </p>
                    </div>

                    {/* Alternating Feature Sections */}
                    <div className="space-y-32 lg:space-y-40">
                        {features.map((feature, i) => (
                            <FeatureSection
                                key={i}
                                {...feature}
                                reversed={i % 2 !== 0}
                                index={i + 1}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── HOW IT WORKS (Pipeline) ─── */}
            <section id="how-it-works" className="py-32 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#6366f1]/[0.03] to-transparent" />
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/20 mb-8">
                            <Brain className="w-3.5 h-3.5 text-[#6366f1]" />
                            <span className="text-[11px] font-black text-[#6366f1] uppercase tracking-widest">How It Works</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-[0.95] mb-6">
                            From Raw Data to
                            <br />Executive Decision
                        </h2>
                        <p className="text-lg text-slate-400 font-medium leading-relaxed">
                            A multi-agent pipeline that autonomously evaluates vendor performance across four dimensions.
                        </p>
                    </div>

                    <div ref={pipelineRef} className="flex flex-col lg:flex-row gap-8 lg:gap-4">
                        {pipelineSteps.map((step, i) => (
                            <PipelineStep
                                key={i}
                                {...step}
                                isVisible={pipelineInView}
                                delay={i * 200}
                                isLast={i === pipelineSteps.length - 1}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FINAL CTA ─── */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6366f1]/10 blur-[120px] rounded-full" />
                </div>

                <div ref={ctaRef} className={`max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10 transition-all duration-1000 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[0.95] mb-6">
                        Ready to Eliminate
                        <br />
                        <span className="bg-gradient-to-r from-[#6366f1] to-violet-400 bg-clip-text text-transparent">the Guesswork?</span>
                    </h2>
                    <p className="text-lg text-slate-400 font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
                        Join the shift from subjective, meeting-driven evaluations to objective, AI-powered contract intelligence.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={onSignUp}
                            className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#6366f1] text-white text-xs font-black uppercase tracking-widest rounded-2xl
                                       hover:bg-[#4f46e5] active:scale-95 transition-all shadow-2xl shadow-[#6366f1]/30 cursor-pointer">
                            Get Started Free
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                        <button onClick={onLogin}
                            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/5 text-white text-xs font-black uppercase tracking-widest rounded-2xl
                                       border border-white/10 hover:bg-white/10 active:scale-95 transition-all cursor-pointer">
                            Login to Dashboard
                        </button>
                    </div>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="border-t border-white/5 py-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#6366f1] p-1.5 rounded-lg">
                            <ShieldCheck className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-xs font-black text-slate-600 uppercase tracking-widest">© 2026 Contract Evaluations • Enterprise Edition</span>
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] hover:text-[#6366f1] transition-colors cursor-pointer">Security Profile</a>
                        <a href="#" className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] hover:text-[#6366f1] transition-colors cursor-pointer">Privacy Charter</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
