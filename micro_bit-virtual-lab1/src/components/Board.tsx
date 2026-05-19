import { useRef } from 'react';
import { motion } from 'motion/react';
import { ComponentInstance } from '../types';
import ComponentBox from './ComponentBox';
import Microbit from './Microbit';

interface BoardProps {
  leds: boolean[][];
  components: ComponentInstance[];
  onValueChange: (id: string, value: number) => void;
  onButtonPress: (button: 'A' | 'B') => void;
  onSensorHover?: (instance: ComponentInstance | null) => void;
}

export default function Board({ leds, components, onValueChange, onButtonPress, onSensorHover }: BoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={boardRef} className="board-container relative w-full aspect-video bg-gradient-to-br from-[#cbd5e1] via-[#f1f5f9] to-[#94a3b8] rounded-[3rem] shadow-[inset_0_-10px_20px_rgba(0,0,0,0.1),0_20px_60px_rgba(0,0,0,0.15)] flex items-center justify-center p-8 overflow-hidden border-[12px] border-[#94a3b8]">
      {/* Texture for "Metallic Desk" surface */}
      <div className="absolute inset-0 opacity-[0.1] mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/brushed-alum.png")' }} />
      
      {/* Simulation Stage Zones - Organic "Scratch Jr" Style */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          {/* Middle Light Blue Zone (Base) */}
          <rect x="0" y="0" width="100" height="100" fill="#4C97FF" />
          
          {/* Left Orange Zone (Input Analog) */}
          <path 
            d="M0,0 
               L50,0 
               C58,20 42,40 50,60 
               C58,80 42,95 50,100 
               L0,100 Z" 
            fill="#FFBF00" 
          />
          
          {/* Right Green Zone (Output Logic) */}
          <path 
            d="M100,0 
               L50,0 
               C58,20 42,40 50,60 
               C58,80 42,95 50,100 
               L100,100 Z" 
            fill="#59C059" 
          />

          {/* Deep Blue Square for Micro:bit placement */}
          <rect x="38" y="34" width="24" height="32" fill="#1A4D99" opacity="0.4" rx="4" />
        </svg>

        {/* Floating Labels (Subtle) */}
        <div className="absolute top-8 left-[20%] -translate-x-1/2">
           <span className="text-[10px] font-black text-[#855D00] uppercase tracking-widest bg-white/30 px-3 py-1 rounded-full backdrop-blur-sm">Analog</span>
        </div>
        <div className="absolute top-8 right-[20%] translate-x-1/2">
           <span className="text-[10px] font-black text-[#2E6B2E] uppercase tracking-widest bg-white/30 px-3 py-1 rounded-full backdrop-blur-sm">Logic</span>
        </div>
      </div>

      {/* Simulation Stage */}
      <div className="relative z-20 flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0, y: 30 }}
          animate={{ scale: 0.48, opacity: 1, y: 0 }}
          transition={{ duration: 1, type: 'spring', bounce: 0.5 }}
          className="relative drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
        >
          {/* Subtle reflection under the board */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[120%] h-24 bg-[#4affaa]/10 blur-[100px] rounded-full" />
          
          <Microbit leds={leds} onButtonPress={onButtonPress} />
        </motion.div>
      </div>

      {/* Connections Layer (SVG) */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 z-15 pointer-events-none w-full h-full">
         {components.map((comp) => (
             <g key={`conn-${comp.id}`}>
               <path
                 d={`M 50 70 L 50 ${comp.y} L ${comp.x} ${comp.y}`}
                 fill="none"
                 stroke="white"
                 strokeWidth="0.5"
                 strokeDasharray="1 1"
                 className="opacity-50"
               />
               <circle cx="50" cy="70" r="1.5" fill="white" />
               <circle cx={comp.x} cy={comp.y} r="1.5" fill="white" />
             </g>
         ))}
      </svg>
      {/* External Components Layout */}
      <div className="absolute inset-0 z-30">
        {components.map((comp) => (
          <div key={comp.id}>
            <ComponentBox 
              instance={comp} 
              onValueChange={(val) => onValueChange(comp.id, val)}
              onHover={onSensorHover}
            />
          </div>
        ))}
      </div>

      {/* Glossy Overlay for Board */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/[0.02] to-transparent" />

      {/* Floating Status Badge */}
      <div className="absolute top-10 right-10 flex items-center gap-3 bg-white/50 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg border border-white/50">
        <div className="w-2 h-2 rounded-full bg-[#4affaa] animate-pulse shadow-[0_0_12px_#4affaa]" />
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] font-sans">Active Core</span>
      </div>
    </div>
  );
}
