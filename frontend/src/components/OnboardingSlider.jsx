import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';

const slides = [
    {
        id: 1,
        title: "The Problem With Messy Data",
        subtitle: "Managing vendor data manually is slow and difficult.",
        description: "Checking vendor performance across different spreadsheets and emails is frustrating. This scattered data leads to mistakes and makes it hard to see which suppliers are actually reliable.",
        image: "/slider_1_problem.png",
        accent: "from-orange-500/20 to-red-600/20 text-orange-400 border-orange-500/50",
        bgGlow: "bg-orange-500/20"
    },
    {
        id: 2,
        title: "AI-Powered Analysis",
        subtitle: "A complete view of your suppliers, analyzed by AI.",
        description: "Our AI automatically connects all your vendor data—like performance scores, incident reports, and reviews—into one place. It does the heavy lifting for you, providing clear and objective summaries.",
        image: "/slider_2_solution.png",
        accent: "from-blue-500/20 to-accent/20 text-accent border-accent/50",
        bgGlow: "bg-accent/20"
    },
    {
        id: 3,
        title: "Smart Insights",
        subtitle: "Expert evaluation is just one click away.",
        description: "Your personalized dashboard gives you a bird's-eye view of vendor health. Simply select any vendor from the registry to start the AI evaluation and see the final grade and report.",
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#08090A]/90 backdrop-blur-2xl overflow-hidden p-4 md:p-12 animate-in fade-in duration-700">
            <div className={`relative w-full transition-all duration-700 ease-out shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 rounded-[40px] flex flex-col md:flex-row bg-[#0B0C0E] overflow-hidden ${
                currentSlide === 2 ? 'max-w-7xl h-[650px]' : 'max-w-5xl h-[600px]'
            }`}>
                
                {/* Visual Section */}
                <div 
                    className={`relative transition-all duration-700 border-r border-white/5 bg-[#0a0b0c] flex flex-col items-center justify-center overflow-hidden z-10 ${
                        currentSlide === 2 ? 'md:w-[70%]' : 'md:w-1/2'
                    }`}
                >
                    {/* Ambient Glow behind the image */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] ${slide.bgGlow} blur-[120px] rounded-full transition-all duration-1000 opacity-20`} />
                    
                    <div 
                        className={`relative w-full h-full flex items-center justify-center transition-all duration-1000 p-8 md:p-12`}
                    >
                        <img 
                            src={slide.image} 
                            alt={slide.title}
                            className={`w-full h-auto object-contain transition-all duration-1000 transform
                                ${animateImages ? 'opacity-100' : 'opacity-0 scale-[0.98]'}
                                ${currentSlide === 2 
                                    ? 'scale-100' 
                                    : 'scale-100 md:scale-[1.1]'
                                }
                            `}
                            style={currentSlide === 2 ? {
                                filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))'
                            } : {}}
                        />
                        
                        {/* Dynamic Edge Mask for Dashboard */}
                        {currentSlide === 2 && (
                            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0b0c] to-transparent z-20" />
                        )}
                    </div>
                </div>

                {/* Narrative Section */}
                <div className={`p-8 md:p-14 flex flex-col justify-center relative transition-all duration-700 z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] ${
                    currentSlide === 2 ? 'md:w-[30%] bg-[#111214]' : 'md:w-1/2 bg-[#111214]'
                }`}>
                    <div className="flex justify-between items-center w-full mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] text-white text-[10px] font-black uppercase tracking-[0.25em] border border-white/5">
                            <Sparkles className="w-3.5 h-3.5 text-accent" />
                            STEP {currentSlide + 1} OF {slides.length}
                        </div>
                        
                        <button 
                            onClick={onComplete}
                            className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                        >
                            Skip
                        </button>
                    </div>

                    <div className={`transition-all duration-700 transform ${animateImages ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-tight mb-4">
                            {slide.title}
                        </h2>
                        <h3 className="text-sm md:text-base font-bold text-accent mb-4">
                            {slide.subtitle}
                        </h3>
                        <p className="text-slate-400 leading-relaxed text-sm font-medium opacity-80">
                            {slide.description}
                        </p>
                    </div>

                    <div className="mt-14 flex items-center justify-between">
                        {/* Interactive Pagination */}
                        <div className="flex gap-2.5">
                            {slides.map((_, idx) => (
                                <div 
                                    key={idx}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${
                                        idx === currentSlide ? 'w-10 bg-white' : 'w-2.5 bg-white/10'
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Navigation Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={prevSlide}
                                disabled={currentSlide === 0}
                                className="w-12 h-12 flex items-center justify-center rounded-2xl border border-white/5 text-slate-500 hover:text-white hover:bg-white/5 disabled:opacity-0 disabled:cursor-not-allowed transition-all active:scale-90"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="px-8 h-12 flex items-center justify-center gap-3 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-widest shadow-2xl hover:bg-slate-100 transition-all active:scale-95"
                            >
                                {currentSlide === slides.length - 1 ? (
                                    <>
                                        Get Started <Check className="w-4 h-4 ml-1" />
                                    </>
                                ) : (
                                    <>
                                        Next <ChevronRight className="w-4 h-4" />
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
