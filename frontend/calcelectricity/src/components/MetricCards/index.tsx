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
                  {/* <span className="flex items-center gap-1.5 font-sans font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    +4.20 €/MWh
                  </span>
                  <span className="text-gray-400">06:00 - 22:00 CET</span> */}
                  <img src="./src/assets/Container (1).png"></img>
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

                  {/* upd */}
                  
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
               <div className="card-img-top p-4 flex flex-col justify-between relative bg-[#f9faf9]"> {/*this line*/}
                {/* Visual Chart showing previous vs current forecast changes */}
                <div className="w-full flex items-center justify-between text-[11px] text-gray-500 font-mono mb-2">
                  {/* <span className="flex items-center gap-1.5 font-sans font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    +4.20 €/MWh
                  </span>
                  <span className="text-gray-400">06:00 - 22:00 CET</span> */}
                  <img src="./src/assets/Explain.png"></img>
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

                  {/* upd */}
                  
                </div>

                {/* <div className="w-full flex justify-between items-center text-[10px] text-gray-400 border-t border-gray-100 pt-1.5 mt-1 font-mono">
                  <span></span>
                  <span className="font-semibold text-emerald-600"></span>
                </div> */}
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
               <div className="card-img-top p-4 flex flex-col justify-between relative bg-[#f9faf9]"> {/*this line*/}
                {/* Visual Chart showing previous vs current forecast changes */}
                <div className="w-full flex items-center justify-between text-[11px] text-gray-500 font-mono mb-2">
                  {/* <span className="flex items-center gap-1.5 font-sans font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    +4.20 €/MWh
                  </span>
                  <span className="text-gray-400">06:00 - 22:00 CET</span> */}
                  <img src="./src/assets/Act.png"></img>
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

                  {/* upd */}
                  
                </div>

                {/* <div className="w-full flex justify-between items-center text-[10px] text-gray-400 border-t border-gray-100 pt-1.5 mt-1 font-mono">
                  <span></span>
                  <span className="font-semibold text-emerald-600"></span>
                </div> */}
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

