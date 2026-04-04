import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';

const slides = [
    {
        id: 1,
        title: "The Problem With Siloed Data",
        subtitle: "Fragmented systems slow down critical evaluation.",
        description: "Evaluating contracts across Metrics, Incidents, Benchmarks, and Reviews manually is disjointed and slow. This siloed data leads to subjective ratings and significant delays in detecting performance trends.",
        image: "/slider_1_problem.png",
        accent: "from-orange-500/20 to-red-600/20 text-orange-400 border-orange-500/50",
        bgGlow: "bg-orange-500/20"
    },
    {
        id: 2,
        title: "Agentic Synthesis",
        subtitle: "A 360-degree view synthesized by AI.",
        description: "Our multi-agentic system connects these four disparate sources. The Reasoning Agent performes a deep-dive analysis, weighing quantitative KPI metrics against qualitative reviews to provide objective, evidence-based recommendations.",
        image: "/slider_2_solution.png",
        accent: "from-blue-500/20 to-brand-600/20 text-brand-400 border-brand-500/50",
        bgGlow: "bg-brand-500/20"
    },
    {
        id: 3,
        title: "Intelligence At Your Fingertips",
        subtitle: "Deep-dive analysis is just one click away.",
        description: "Your personalized dashboard provides a bird's eye view of vendor health. Simply click any vendor in the evaluation table below to trigger the AI screening and view a full reasoning chain and grade report.",
        image: "/slider_3_action.png",
        accent: "from-teal-500/20 to-emerald-600/20 text-teal-400 border-teal-500/50",
        bgGlow: "bg-teal-500/20"
    }
];

const OnboardingSlider = ({ onComplete }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [animateImages, setAnimateImages] = useState(true);

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setAnimateImages(false);
            setTimeout(() => {
                setCurrentSlide(prev => prev + 1);
                setAnimateImages(true);
            }, 300);
        } else {
            onComplete();
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setAnimateImages(false);
            setTimeout(() => {
                setCurrentSlide(prev => prev - 1);
                setAnimateImages(true);
            }, 300);
        }
    };

    const slide = slides[currentSlide];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 overflow-hidden">
            {/* Background Glow */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full blur-[120px] transition-colors duration-1000 ${slide.bgGlow} opacity-30`} />

            <div className="relative w-full max-w-6xl w-[90%] md:h-[80vh] bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                
                {/* Left Side - Image/Visuals */}
                <div className="md:w-1/2 relative bg-slate-950/50 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-700/50 p-8">
                    <img 
                        src={slide.image} 
                        alt={slide.title}
                        className={`w-full max-h-[40vh] md:max-h-none object-contain transition-all duration-700 transform ${animateImages ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                    />
                </div>

                {/* Right Side - Content */}
                <div className="md:w-1/2 p-8 md:p-14 flex flex-col justify-center gap-6 relative">
                    {/* Tags */}
                    <div className="flex justify-between items-center w-full">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-gradient-to-r text-xs font-bold uppercase tracking-wider ${slide.accent}`}>
                            <Sparkles className="w-3.5 h-3.5" />
                            Step {currentSlide + 1} of {slides.length}
                        </div>
                        
                        {/* Skip btn */}
                        <button 
                            onClick={onComplete}
                            className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
                        >
                            Skip intro
                        </button>
                    </div>

                    <div className={`transition-all duration-500 transform ${animateImages ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mt-6">
                            {slide.title}
                        </h2>
                        <h3 className="text-xl md:text-2xl font-medium text-slate-300 mt-3">
                            {slide.subtitle}
                        </h3>
                        <p className="text-slate-400 leading-relaxed mt-6 text-lg">
                            {slide.description}
                        </p>
                    </div>

                    <div className="mt-auto pt-10 flex items-center justify-between">
                        {/* Dots */}
                        <div className="flex gap-2">
                            {slides.map((_, idx) => (
                                <div 
                                    key={idx}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${
                                        idx === currentSlide ? 'w-8 bg-brand-400' : 'w-2 bg-slate-700'
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Controls */}
                        <div className="flex gap-3">
                            <button
                                onClick={prevSlide}
                                disabled={currentSlide === 0}
                                className="w-12 h-12 flex items-center justify-center rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="px-6 h-12 flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold transition-all group active:scale-95 shadow-lg shadow-brand-500/20"
                            >
                                {currentSlide === slides.length - 1 ? (
                                    <>
                                        Get Started <Check className="w-5 h-5 ml-1" />
                                    </>
                                ) : (
                                    <>
                                        Next <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingSlider;
