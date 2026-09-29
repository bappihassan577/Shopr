import React from 'react';
import { Sparkles, ShieldCheck, Zap, Truck, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  title: string;
  subtitle: string;
  onExploreClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  onExploreClick
}) => {
  return (
    <section className="pt-6 pb-8">
      <div className="relative rounded-3xl bg-slate-900 text-white overflow-hidden shadow-2xl p-8 sm:p-12 lg:p-16 border border-slate-800">
        
        {/* Decorative backdrop gradients */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-24 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Curated Excellence • Verified Quality</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1] font-['Plus_Jakarta_Sans']">
            {title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-10">
            <button
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-102 active:scale-98"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="/shopr.zip"
              download="shopr.zip"
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl font-semibold text-sm backdrop-blur-sm transition-all"
            >
              <span>Download Full Package (shopr.zip)</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-300">100% Verified Vendors</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Truck className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-300">Fast Global Delivery</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-300">Direct Checkout Routing</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
