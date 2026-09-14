import React, { useState } from 'react'
import SectionHeader from '../SectionHeader'
import { Wind, Sun, Flame, Zap, Droplets, MousePointer, CheckCircle2, TrendingUp } from 'lucide-react'
import './index.css'

interface FeatureCard {
  id: string
  title: string
  description: string
  tag?: string
}

const CARDS: FeatureCard[] = [
  {
    id: 'monitor',
    title: 'Monitor',
    description: 'What changed since the previous forecast?',
  },
  {
    id: 'explain',
    title: 'Explain',
    description: 'Which drivers caused the movement?',
  },
  {
    id: 'act',
    title: 'Act',
    description: 'Does the change require a decision now?',
  },
]

export default function MetricCards() {
  const [activeDriver, setActiveDriver] = useState<string | null>(null)
  const [actionConfirmed, setActionConfirmed] = useState(false)

  return (
    <section className="metrics-section section py-16 bg-white" id="complex-market-data">
      <div className="container">
        {/* Section Header with green vertical indicator as seen in screenshot */}
        <SectionHeader
          title="Complex market data"
          text="The experience is structured around the questions electricity-market users ask under time pressure"
        />

        {/* 12-column Grid System from the presentation: row + col-12 col-md-4 + g-4 */}
        <div className="row g-4">
          {/* Card 1: Monitor */}
          <div className="col-12 col-md-4">
            <div className="card h-full">
               <div className="card-img-top p-4 flex flex-col justify-between relative bg-[#f9faf9]"> {/*this line*/}
                {/* Visual Chart showing previous vs current forecast changes */}
                <div className="w-full flex items-center justify-between text-[11px] text-gray-500 font-mono mb-2">
                  <span className="flex items-center gap-1.5 font-sans font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    +4.20 €/MWh
                  </span>
                  <span className="text-gray-400">06:00 - 22:00 CET</span>
                </div>

                {/* SVG Area Chart matching screenshot */}
                <div className="relative w-full h-32 flex items-center justify-center">
                  <svg
                    viewBox="0 0 320 140"
                    className="w-full h-full overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="monitorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
                        <stop offset="70%" stopColor="#10b981" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
                      </linearGradient>
                    </defs>

                    {/* Subtle horizontal grid lines */}
                    <line x1="0" y1="35" x2="320" y2="35" stroke="#e5e7eb" strokeDasharray="3 3" />
                    <line x1="0" y1="70" x2="320" y2="70" stroke="#e5e7eb" strokeDasharray="3 3" />
                    <line x1="0" y1="105" x2="320" y2="105" stroke="#e5e7eb" strokeDasharray="3 3" />

                    {/* Previous forecast baseline (dashed) */}
                    <path
                      d="M 10,85 C 50,82 90,95 130,78 C 170,62 210,88 250,75 C 280,66 305,68 310,70"
                      stroke="#9ca3af"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />

                    {/* Current revised forecast (green area & solid stroke) */}
                    <path
                      d="M 10,95 C 40,90 70,72 100,55 C 130,38 160,45 190,62 C 220,78 250,42 280,32 C 298,26 308,30 315,34 L 315,130 L 10,130 Z"
                      fill="url(#monitorGradient)"
                    />
                    <path
                      d="M 10,95 C 40,90 70,72 100,55 C 130,38 160,45 190,62 C 220,78 250,42 280,32 C 298,26 308,30 315,34"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Peak revision marker dot */}
                    <circle cx="280" cy="32" r="4.5" fill="#10b981" />
                    <circle cx="280" cy="32" r="8" stroke="#10b981" strokeOpacity="0.3" strokeWidth="2" />
                  </svg>
                </div>

                {/* <div className="w-full flex justify-between items-center text-[10px] text-gray-400 border-t border-gray-100 pt-1.5 mt-1 font-mono">
                  <span></span>
                  <span className="font-semibold text-emerald-600"></span>
                </div> */}
              </div>

              {/* Card Body from presentation */}
              <div className="card-body">
                <h3 className="card-title text-xl font-semibold text-gray-900 mb-1.5">
                  {CARDS[0].title}
                </h3>
                <p className="card-text text-gray-600 leading-relaxed text-sm">
                  {CARDS[0].description}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Explain */}
          <div className="col-12 col-md-4">
            <div className="card h-full">
              <div className="card-img-top p-4 flex items-center justify-center relative bg-[#f9faf9] overflow-hidden">
                {/* Orbiting drivers around Voltio center */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                  {/* Outer subtle orbit circle */}
                  <div className="absolute inset-2 border border-dashed border-gray-200 rounded-full" />
                  
                  {/* Central Voltio Brand Node */}
                  <div className="z-10 bg-white px-3.5 py-1.5 rounded-full shadow-sm border border-gray-200/80 flex items-center gap-1.5 transition-transform hover:scale-105">
                    <span className="font-bold tracking-tight text-gray-900 text-sm">Voltio</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  {/* Driver Node 1: Wind (Top Right) */}
                  <button
                    type="button"
                    onMouseEnter={() => setActiveDriver('Wind generation')}
                    onMouseLeave={() => setActiveDriver(null)}
                    className="absolute top-2 right-6 p-2 rounded-full bg-gray-900 text-white shadow-sm hover:scale-110 transition-transform cursor-pointer"
                    title="Wind generation"
                  >
                    <Wind className="w-3.5 h-3.5" />
                  </button>

                  {/* Driver Node 2: Solar (Left) */}
                  <button
                    type="button"
                    onMouseEnter={() => setActiveDriver('Solar peak drop')}
                    onMouseLeave={() => setActiveDriver(null)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-amber-500 text-white shadow-sm hover:scale-110 transition-transform cursor-pointer"
                    title="Solar generation"
                  >
                    <Sun className="w-3.5 h-3.5" />
                  </button>

                  {/* Driver Node 3: Hydro (Right) */}
                  <button
                    type="button"
                    onMouseEnter={() => setActiveDriver('Hydro reservoir')}
                    onMouseLeave={() => setActiveDriver(null)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-emerald-500 text-white shadow-sm hover:scale-110 transition-transform cursor-pointer"
                    title="Hydro capacity"
                  >
                    <Droplets className="w-3.5 h-3.5" />
                  </button>

                  {/* Driver Node 4: Battery / Demand (Bottom Left) */}
                  <button
                    type="button"
                    onMouseEnter={() => setActiveDriver('Industrial demand')}
                    onMouseLeave={() => setActiveDriver(null)}
                    className="absolute bottom-3 left-6 p-2 rounded-full bg-purple-600 text-white shadow-sm hover:scale-110 transition-transform cursor-pointer"
                    title="Grid demand"
                  >
                    <Zap className="w-3.5 h-3.5" />
                  </button>

                  {/* Driver Node 5: Gas Flame (Bottom Right) */}
                  <button
                    type="button"
                    onMouseEnter={() => setActiveDriver('Gas price pressure')}
                    onMouseLeave={() => setActiveDriver(null)}
                    className="absolute bottom-3 right-6 p-2 rounded-full bg-rose-500 text-white shadow-sm hover:scale-110 transition-transform cursor-pointer"
                    title="Gas spark spread"
                  >
                    <Flame className="w-3.5 h-3.5" />
                  </button>

                  {/* Connecting dashed rays */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none text-gray-300">
                    <line x1="96" y1="96" x2="145" y2="28" stroke="currentColor" strokeDasharray="3 3" />
                    <line x1="96" y1="96" x2="28" y2="96" stroke="currentColor" strokeDasharray="3 3" />
                    <line x1="96" y1="96" x2="164" y2="96" stroke="currentColor" strokeDasharray="3 3" />
                    <line x1="96" y1="96" x2="48" y2="158" stroke="currentColor" strokeDasharray="3 3" />
                    <line x1="96" y1="96" x2="148" y2="158" stroke="currentColor" strokeDasharray="3 3" />
                  </svg>
                </div>

                {/* Driver indicator tooltip */}
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <span className="text-[11px] font-medium text-gray-500 bg-white/90 px-2 py-0.5 rounded-full border border-gray-200/60 shadow-xs">
                    {activeDriver || 'Hover any driver node'}
                  </span>
                </div>
              </div>

              {/* Card Body from presentation */}
              <div className="card-body">
                <h3 className="card-title text-xl font-semibold text-gray-900 mb-1.5">
                  {CARDS[1].title}
                </h3>
                <p className="card-text text-gray-600 leading-relaxed text-sm">
                  {CARDS[1].description}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Act */}
          <div className="col-12 col-md-4">
            <div className="card h-full">
              <div className="card-img-top p-4 flex items-center justify-center relative bg-[#f9faf9]">
                {/* Decision / Action UI snippet as seen on screenshot */}
                <div className="w-full max-w-[240px] bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200/60">
                      Trade
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Confidence 94%
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mb-3">
                    Hedge peak ramp hour 18:00
                  </p>

                  <button
                    type="button"
                    onClick={() => setActionConfirmed(!actionConfirmed)}
                    className={`w-full py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      actionConfirmed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {actionConfirmed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Decision Logged
                      </>
                    ) : (
                      <>Confirm Position</>
                    )}
                  </button>

                  {/* Simulated cursor arrow like in design */}
                  <div className="absolute -bottom-2 -right-1 pointer-events-none transform -rotate-12 translate-y-2">
                    <MousePointer className="w-4 h-4 text-gray-700 fill-gray-900 drop-shadow" />
                  </div>
                </div>
              </div>

              {/* Card Body from presentation */}
              <div className="card-body">
                <h3 className="card-title text-xl font-semibold text-gray-900 mb-1.5">
                  {CARDS[2].title}
                </h3>
                <p className="card-text text-gray-600 leading-relaxed text-sm">
                  {CARDS[2].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

