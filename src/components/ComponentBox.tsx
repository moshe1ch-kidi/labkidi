import React from 'react';
import { motion } from 'motion/react';
import { ComponentInstance } from '../types';
import { 
  Sun, 
  Thermometer, 
  RotateCw, 
  Settings2,
  Cpu,
  Zap,
  Droplets,
  Palette
} from 'lucide-react';

interface ComponentBoxProps {
  instance: ComponentInstance;
  onValueChange?: (value: number) => void;
  onHover?: (instance: ComponentInstance | null) => void;
  onSwapClick?: (id: string) => void;
  boardScale?: number;
}

export default function ComponentBox({ instance, onValueChange, onHover, onSwapClick, boardScale }: ComponentBoxProps) {
  const isInput = [
    'light_sensor', 'color_sensor', 'temp_sensor', 'pir_sensor', 'potentiometer', 
    'button', 'switch', 'humidity_sensor', 'ultrasonic_sensor', 'red_led', 
    'yellow_led', 'motor', 'servo', 'stepper_motor'
  ].includes(instance.type);

  const getRange = () => {
    switch(instance.type) {
      case 'temp_sensor': return { min: -10, max: 50, step: 1, unit: '°C' };
      case 'humidity_sensor': return { min: 0, max: 100, step: 1, unit: '%' };
      case 'light_sensor': return { min: 0, max: 1023, step: 1, unit: 'lx' };
      case 'color_sensor': return { min: 0, max: 5, step: 1, unit: '' };
      case 'potentiometer': return { min: 0, max: 1023, step: 1, unit: '' };
      case 'button':
      case 'switch': return { min: 0, max: 1, step: 1, unit: '' };
      case 'red_led':
      case 'yellow_led': return { min: 0, max: 1, step: 1, unit: '' };
      case 'ultrasonic_sensor': return { min: 0, max: 400, step: 1, unit: 'cm' };
      case 'motor': return { min: 0, max: 100, step: 1, unit: '%' };
      case 'servo': return { min: 0, max: 180, step: 1, unit: '°' };
      default: return { min: 0, max: 100, step: 1, unit: '%' };
    }
  };

  const getDisplayValue = () => {
    if (instance.type === 'color_sensor') {
      const colors = [
        '🔴 אדום',
        '🟢 ירוק',
        '🔵 כחול',
        '🟡 צהוב',
        '🟠 כתום',
        '🟣 סגול'
      ];
      return colors[instance.value] || '---';
    }
    return `${instance.value}${unit}`;
  };

  const { min, max, step, unit } = getRange();

  // Render the specific "Sensor Element" based on type
  const renderSensorElement = () => {
    switch (instance.type) {
      case 'color_sensor': {
        const colorMap = [
          '#ef4444', // Red
          '#22c55e', // Green
          '#3b82f6', // Blue
          '#eab308', // Yellow
          '#f97316', // Orange
          '#a855f7'  // Purple
        ];
        const activeColor = colorMap[instance.value] || '#ef4444';
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-0.5 uppercase">
             {/* Central active glowing color circle */}
             <div className="relative mb-1">
                <Palette className="w-5 h-5 text-gray-700 transition-colors" style={{ color: activeColor }} />
             </div>
             
             {/* TCS34725 Style Color Sensor PCB (Purple color PCB is typical for TCS34725) */}
             <div className="relative z-10 w-15 h-12 bg-purple-950 rounded-lg p-1 shadow-[0_3px_8px_rgba(0,0,0,0.4)] flex items-center justify-center border border-purple-800">
                <div className="w-full h-full bg-[#111] rounded-[5px] relative overflow-hidden flex flex-col items-center justify-center">
                   
                   {/* 4 Corner White LEDs as light source */}
                   <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-yellow-50 rounded-full shadow-[0_0_4px_#fff]" />
                   <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-yellow-50 rounded-full shadow-[0_0_4px_#fff]" />
                   <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-yellow-50 rounded-full shadow-[0_0_4px_#fff]" />
                   <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-yellow-50 rounded-full shadow-[0_0_4px_#fff]" />
                   
                   {/* Central Photodiode chip with active optical filter color */}
                   <div className="w-6 h-6 rounded-full border border-slate-600 flex items-center justify-center bg-slate-900 relative">
                      <motion.div 
                        animate={{ backgroundColor: activeColor }}
                        transition={{ duration: 0.3 }}
                        className="w-3.5 h-3.5 rounded-full shadow-inner" 
                        style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' }}
                      />
                   </div>
                   
                </div>
             </div>
             
             <div className="mt-1.5 text-[7px] text-slate-400 font-black tracking-widest">RGB COLOR</div>
          </div>
        );
      }
      case 'lcd_display':
        return (
          <div className="w-full h-full p-1">
             <div className="w-full h-full bg-[#1a1a5a] rounded-sm border-4 border-gray-400 shadow-lg flex flex-col justify-center px-2 py-1 overflow-hidden font-mono">
                <div className="text-[6px] text-blue-200 opacity-80 leading-tight">HELLO_MICROBIT</div>
                <div className="text-[6px] text-blue-300 font-bold leading-tight">READY_TO_TEST...</div>
             </div>
          </div>
        );
      case 'ultrasonic_sensor':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-1">
             <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
                {/* Main Blue PCB */}
                <rect x="5" y="10" width="90" height="40" rx="3" fill="#0000AA" stroke="#000066" strokeWidth="1" />
                
                {/* PCB Silk Screen Textures */}
                <path d="M10 15H20M10 45H20M80 15H90M80 45H90" stroke="white" strokeOpacity="0.1" strokeWidth="0.5" />
                
                {/* Left Transducer (T) */}
                <g>
                   {/* Metal Body */}
                   <circle cx="30" cy="30" r="15" fill="url(#metal_grad)" stroke="#777" strokeWidth="1" />
                   {/* Internal Mesh/Lense */}
                   <circle cx="30" cy="30" r="12" fill="#222" />
                   <circle cx="30" cy="30" r="12" fill="url(#mesh_pattern)" fillOpacity="0.6" />
                   <circle cx="30" cy="30" r="8" fill="url(#inner_grad)" />
                </g>

                {/* Crystal Oscillator in Middle */}
                <rect x="47" y="25" width="6" height="10" rx="3" fill="url(#crystal_grad)" stroke="#888" strokeWidth="0.5" />

                {/* Right Transducer (R) */}
                <g>
                   {/* Metal Body */}
                   <circle cx="70" cy="30" r="15" fill="url(#metal_grad)" stroke="#777" strokeWidth="1" />
                   {/* Internal Mesh/Lense */}
                   <circle cx="70" cy="30" r="12" fill="#222" />
                   <circle cx="70" cy="30" r="12" fill="url(#mesh_pattern)" fillOpacity="0.6" />
                   <circle cx="70" cy="30" r="8" fill="url(#inner_grad)" />
                </g>

                {/* Header Pins */}
                <g transform="translate(40, 50)">
                   <rect x="0" y="0" width="2" height="6" fill="#D4AF37" />
                   <rect x="6" y="0" width="2" height="6" fill="#D4AF37" />
                   <rect x="12" y="0" width="2" height="6" fill="#D4AF37" />
                   <rect x="18" y="0" width="2" height="6" fill="#D4AF37" />
                </g>

                {/* Definitions */}
                <defs>
                   <linearGradient id="metal_grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#EEEEEE" />
                      <stop offset="100%" stopColor="#999999" />
                   </linearGradient>
                   <linearGradient id="crystal_grad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#CCCCCC" />
                      <stop offset="50%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#999999" />
                   </linearGradient>
                   <radialGradient id="inner_grad">
                      <stop offset="0%" stopColor="#444" />
                      <stop offset="100%" stopColor="#111" />
                   </radialGradient>
                   <pattern id="mesh_pattern" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
                      <circle cx="1" cy="1" r="0.5" fill="white" />
                   </pattern>
                </defs>
             </svg>
          </div>
        );
      case 'buzzer':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
             <div className="relative w-16 h-16 rounded-full bg-[#333] shadow-2xl flex items-center justify-center border-4 border-[#444]">
                <div className="absolute inset-1 rounded-full bg-[#444] shadow-inner border border-white/5" />
                <div className="relative grid grid-cols-3 gap-2 p-2">
                   {[...Array(9)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-black shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]" />
                   ))}
                </div>
                {instance.value > 0 && (
                   <motion.div 
                      animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 0.15, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border-4 border-yellow-400 blur-[2px]" 
                   />
                )}
             </div>
          </div>
        );
      case 'seven_segment':
        return (
          <div className="bg-black/90 p-1.5 rounded-sm border-2 border-gray-800 flex gap-0.5 shadow-inner">
             {[8,8,8,8].map((num, i) => (
                <div key={i} className="text-[#ff1a1a] font-mono text-base font-black italic tracking-tight opacity-90 drop-shadow-[0_0_2px_rgba(255,0,0,0.5)]">
                   {num}
                </div>
             ))}
          </div>
        );
      case 'red_led':
      case 'yellow_led':
        const isRed = instance.type === 'red_led';
        const brightness = instance.value > 1 
          ? Math.min(instance.value / 1023, 1) 
          : (instance.value > 0 ? 1 : 0);
        
        const ledStyle = isRed 
          ? {
              backgroundColor: brightness > 0 ? `rgba(239, 68, 68, ${0.4 + brightness * 0.6})` : 'rgba(127, 29, 29, 0.4)',
              boxShadow: brightness > 0 ? `0 0 ${10 + brightness * 25}px rgba(239, 68, 68, ${0.5 + brightness * 0.5})` : 'none',
            }
          : {
              backgroundColor: brightness > 0 ? `rgba(250, 204, 21, ${0.4 + brightness * 0.6})` : 'rgba(113, 63, 18, 0.4)',
              boxShadow: brightness > 0 ? `0 0 ${10 + brightness * 25}px rgba(250, 204, 21, ${0.5 + brightness * 0.5})` : 'none',
            };
        const borderColor = isRed ? 'border-red-950' : 'border-yellow-950';

        return (
          <div className="flex flex-col items-center justify-center gap-1 scale-125">
             <div className="relative">
                {/* Glass Bulb */}
                <div 
                   className={`w-10 h-10 rounded-full border-2 ${borderColor} transition-all duration-300 flex items-center justify-center`}
                   style={ledStyle}
                >
                   {/* Internal Filament/Effect */}
                   <div 
                      className="w-4 h-4 rounded-full bg-white/50 blur-[3px] transition-all duration-300" 
                      style={{ opacity: brightness }}
                   />
                </div>
                {/* Reflection highlight */}
                <div className="absolute top-1.5 left-2 w-3 h-3 bg-white/30 rounded-full blur-[1px]" />
             </div>
             {/* Metallic Base */}
             <div className="w-6 h-3 bg-gradient-to-b from-slate-400 to-slate-600 rounded-b-sm border-x border-slate-500 shadow-sm" />
          </div>
        );
      case 'light_sensor':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-0.5 uppercase">
             {/* Sun icon indicator above LDR */}
             <div className="relative mb-1">
                <Sun className={`w-5 h-5 text-yellow-400 transition-opacity ${instance.value > 500 ? 'opacity-100 animate-pulse' : 'opacity-40'}`} />
             </div>
             
             {/* Central LDR Component Container (Rounded oblong with Orange Housing) */}
             <div className="relative z-10 w-14 h-10 bg-orange-600 rounded-lg p-0.5 shadow-[0_3px_8px_rgba(0,0,0,0.4)] flex items-center justify-center">
                <div className="w-full h-full bg-[#f8fbff] rounded-[5px] relative overflow-hidden flex flex-col items-center justify-center border border-white/20">
                   {/* Serpentine Tracks (Burnt Orange/Reddish) */}
                   <div className="w-12 h-8 flex items-center justify-center mt-0.5">
                      <svg width="36" height="22" viewBox="0 0 36 24" fill="none" className="opacity-95">
                         <path 
                           d="M6 4 H 30 C 33 4 33 8 30 8 H 6 C 3 8 3 12 6 12 H 30 C 33 12 33 16 30 16 H 6 C 3 16 3 20 6 20 H 30" 
                           stroke="#c2410c" 
                           strokeWidth="3.5" 
                           strokeLinecap="round" 
                         />
                      </svg>
                   </div>
                   
                   {/* Metallic Solder Dots on the sides */}
                   <div className="absolute left-0.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-slate-300 rounded-full shadow-inner border border-slate-400/50" />
                   <div className="absolute right-0.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-slate-300 rounded-full shadow-inner border border-slate-400/50" />
                </div>
             </div>
             
             {/* Base Label on the white surface */}
             <div className="mt-1.5 text-[7px] text-slate-400 font-black tracking-widest">LDR LIGHT</div>
          </div>
        );
      case 'temp_sensor':
        return (
          <div className="relative w-full h-full flex items-center justify-center p-2">
             <div className="relative z-10 w-12 h-14 bg-sky-500 rounded-lg flex flex-col items-center justify-start py-1.5 border-t-2 border-white/30 shadow-xl">
                <div className="grid grid-cols-2 gap-1 px-1">
                   {Array(8).fill(0).map((_, i) => (
                     <div key={i} className="w-3.5 h-1.5 bg-white/20 rounded-full" />
                   ))}
                </div>
                <div className="mt-auto flex flex-col items-center gap-1 mb-1">
                   <Thermometer className="w-4 h-4 text-white opacity-80" />
                   <div className="w-8 h-1 bg-sky-600 rounded-full" />
                </div>
             </div>
          </div>
        );
      case 'humidity_sensor':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-end pb-4">
             {/* Blue DHT11 style sensor body - moved down */}
             <div className="relative z-10 w-12 h-15 bg-blue-600 rounded-md flex flex-col items-center justify-start py-1 border-t-2 border-white/40 shadow-2xl">
                <div className="grid grid-cols-2 gap-1.5 px-1.5 opacity-90">
                   {Array(10).fill(0).map((_, i) => (
                     <div key={i} className="w-4 h-0.5 bg-white/20 rounded-full" />
                   ))}
                </div>
                <div className="mt-auto flex items-center justify-center pb-2">
                   <Droplets className="w-5 h-5 text-blue-100 animate-pulse" />
                </div>
                {/* Connection Pins visual */}
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1">
                  <div className="w-0.5 h-4 bg-slate-400 rounded-full shadow-sm" />
                  <div className="w-0.5 h-4 bg-slate-400 rounded-full shadow-sm" />
                  <div className="w-0.5 h-4 bg-slate-400 rounded-full shadow-sm" />
                </div>
             </div>
          </div>
        );
      case 'pir_sensor':
        return (
          <div className="relative w-full h-full flex items-center justify-center p-2">
             <div className="relative z-10 w-14 h-14 bg-white rounded-full border-[8px] border-white shadow-[0_10px_20px_rgba(0,0,0,0.2)] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '4px_4px' }} />
                <div className="w-8 h-8 bg-gray-50 rounded-full border border-gray-100 shadow-inner" />
             </div>
             <div className="absolute bottom-0 text-[7px] text-slate-400 font-black tracking-widest uppercase">PIR MOTION</div>
          </div>
        );
      case 'potentiometer':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-1">
             {/* Main Blue Rectangular Base House */}
             <div className="relative w-16 h-12 bg-[#2596be] rounded-sm shadow-[0_4px_8px_rgba(0,0,0,0.3)] border border-[#1e7a9c] flex items-end justify-center pb-0.5 overflow-hidden">
                {/* Metallic Side Clips/Solder tabs */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-3.5 bg-slate-300 rounded-[1px] border border-slate-400 shadow-sm" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-3.5 bg-slate-300 rounded-[1px] border border-slate-400 shadow-sm" />
                
                {/* PCB Trace effect on base */}
                <div className="absolute inset-x-1 top-1 h-[2px] bg-[#1e7a9c]/30 rounded-full" />
             </div>
 
             {/* The Black Potentiometer Body (Tall Cylinder) */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[65%] z-20">
                {/* Main Shaft/Body */}
                <div className="w-12 h-12 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-950 rounded-lg shadow-2xl border-x border-gray-700 relative overflow-hidden">
                   {/* Vertical Ridges for texture */}
                   <div className="absolute inset-0 flex justify-between px-1 opacity-20 pointer-events-none">
                      {[1,2,3,4,5].map(i => <div key={i} className="w-[1px] h-full bg-white/20 shadow-sm" />)}
                   </div>
                </div>
 
                {/* The Rotating Knob Cap (Blue Top) */}
                <motion.div 
                   animate={{ rotate: (instance.value / 1023) * 270 - 135 }}
                   className="absolute top-0 left-1/2 -translate-x-1/2 -mt-1 w-12 h-12 bg-[#3eb4e4] rounded-full border-2 border-[#2596be] shadow-lg flex items-center justify-center z-30"
                >
                   {/* Indicator Notch */}
                   <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-black/80 rounded-sm" />
                   {/* Top Surface highlight */}
                   <div className="w-10 h-10 rounded-full border border-white/10" />
                </motion.div>
             </div>
             
             {/* Base perspective shadow */}
             <div className="absolute bottom-2 w-18 h-4 bg-black/10 blur-[4px] rounded-full -z-10" />
          </div>
        );
      case 'motor':
      case 'stepper_motor':
      case 'servo':
        const isStepper = instance.type === 'stepper_motor';
        const isServo = instance.type === 'servo';
        const speed = (instance.value / 100) * (isStepper ? 1 : 2);
        const duration = speed > 0 ? (2 / speed) : 0;
        
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-2">
             {/* Realistic Motor Metal Housing */}
             <div className={`relative ${isStepper || isServo ? 'w-16 h-16 rounded-md' : 'w-18 h-14 rounded-lg'} bg-gradient-to-tr from-slate-400 via-slate-200 to-slate-400 shadow-xl border border-slate-500/50 flex items-center justify-center overflow-hidden transition-all duration-500`}>
                {!(isStepper || isServo) && <div className="absolute top-1 right-2 text-[4px] text-slate-400 font-mono opacity-40">DC 3-6V</div>}
                {(isStepper || isServo) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10">
                    <div className="w-full h-px bg-black" />
                    <div className="w-full h-px bg-black mt-2" />
                    <div className="w-full h-px bg-black mt-2" />
                  </div>
                )}
                
                {/* Motor Shaft Front (Small metallic circle) */}
                <div className="w-4 h-4 bg-slate-300 rounded-full border border-slate-400 shadow-inner flex items-center justify-center z-10">
                   <div className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                </div>
 
                {/* Solder Tabs/Wires */}
                <div className="absolute -left-1 flex flex-col gap-3">
                   <div className={`w-3 h-2 ${isStepper ? 'bg-blue-600' : isServo ? 'bg-blue-500' : 'bg-red-600'} rounded-[1px] opacity-80`} />
                   <div className={`w-3 h-2 ${isStepper ? 'bg-green-600' : isServo ? 'bg-red-500' : 'bg-slate-800'} rounded-[1px] opacity-80`} />
                </div>
                
                {isServo && (
                  <div className="absolute bottom-1 right-1 w-2 h-2 bg-orange-600 rounded-full opacity-50" />
                )}
             </div>
 
             {/* Propeller/Pointer/Servo Arm */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                <motion.div
                  animate={isServo ? { rotate: instance.value - 90 } : (instance.value > 0 ? { rotate: 360 } : { rotate: 0 })}
                  transition={isServo ? { type: "spring", stiffness: 300, damping: 20 } : (instance.value > 0 ? { 
                    duration: duration, 
                    repeat: Infinity, 
                    ease: "linear" 
                  } : { duration: 0.2 })}
                  key={isServo ? 'servo' : `motor-${instance.id}-${duration}`}
                  className={`relative ${isStepper || isServo ? 'w-22 h-22' : 'w-28 h-28'} flex items-center justify-center`}
                >
                   {/* Propeller Blades (Yellow) - Only for DC Motor */}
                   {!(isStepper || isServo) ? [0, 90, 180, 270].map(angle => (
                     <div 
                       key={angle} 
                       className="absolute w-12 h-7 bg-[#facc15] rounded-full border border-[#a16207] shadow-sm transform-origin-center"
                       style={{ 
                         transform: `rotate(${angle}deg) translateX(14px) skewX(20deg)`,
                         boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.1)'
                       }}
                     />
                   )) : isStepper ? (
                     /* Stepper Pointer/Hub */
                     <div className="relative w-full h-full flex items-center justify-center">
                        <div className="w-16 h-1 bg-slate-800/40 rounded-full absolute" />
                        <div className="w-1 h-16 bg-slate-800/40 rounded-full absolute" />
                        <div className="w-10 h-10 bg-slate-700 rounded-full border-2 border-slate-500 shadow-lg" />
                        <div className="w-1.5 h-5 bg-red-500 rounded-full absolute -top-5" />
                     </div>
                   ) : (
                     /* Servo Arm (White Horn) */
                     <div className="relative w-full h-full flex items-center justify-center">
                        <div className="w-18 h-4 bg-white rounded-full border border-slate-300 shadow-md flex items-center justify-between px-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-slate-200 border border-slate-300" />
                           <div className="w-1.5 h-1.5 rounded-full bg-slate-200 border border-slate-300" />
                        </div>
                        <div className="w-6 h-6 bg-white rounded-full border-2 border-slate-400 shadow-md absolute z-20 flex items-center justify-center">
                           <div className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
                        </div>
                     </div>
                   )}
                   
                   {!(isStepper || isServo) && (
                     <div className="w-6 h-6 bg-[#facc15] rounded-full border-2 border-[#a16207] shadow-md z-40 flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#a16207]/20 rounded-full" />
                     </div>
                   )}
                </motion.div>
             </div>
             
             {/* Sub-label */}
             <div className="absolute bottom-1 text-[6px] text-slate-400 uppercase tracking-tighter">
                {isStepper ? 'Stepper Module' : isServo ? 'Position Servo' : 'Propeller Unit'}
             </div>
          </div>
        );
      case 'button':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
             <div className="w-12 h-12 bg-[#1a1a1a]/40 rounded-full blur-[2px] absolute translate-y-1" />
             <motion.button
                onPointerDown={() => onValueChange?.(1)}
                onPointerUp={() => onValueChange?.(0)}
                onPointerLeave={() => onValueChange?.(0)}
                className={`relative z-10 w-12 h-12 rounded-full border-2 transition-all shadow-md flex items-center justify-center ${
                   instance.value === 1 ? 'bg-orange-500 border-orange-700' : 'bg-blue-600 border-blue-800'
                }`}
             >
                <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
             </motion.button>
          </div>
        );
      case 'switch':
        return (
          <div className="relative w-full h-full flex items-center justify-center p-2">
             <div className="absolute inset-0 bg-[#1a1a1a] rounded-lg shadow-inner" />
             <div 
                className="relative z-10 w-20 h-10 bg-slate-900 rounded-full border-2 border-slate-700 shadow-2xl cursor-pointer overflow-hidden p-1"
                onClick={() => onValueChange?.(instance.value > 0 ? 0 : 1)}
             >
                <motion.div 
                   animate={{ 
                     x: instance.value > 0 ? 36 : 0,
                     backgroundColor: instance.value > 0 ? '#3b82f6' : '#64748b'
                   }}
                   className="w-8 h-full rounded-full shadow-lg border border-white/20 flex items-center justify-center"
                >
                   <div className="w-0.5 h-3 bg-white/40 rounded-full" />
                </motion.div>
                <div className="absolute inset-x-4 inset-y-0 flex justify-between items-center pointer-events-none opacity-20">
                   <div className="w-1 h-1 bg-white rounded-full" />
                   <div className="w-1 h-3 bg-white rounded-full" />
                </div>
             </div>
          </div>
        );
      default:
        return (
          <div className="relative w-full h-full flex items-center justify-center">
             <div className="absolute inset-0 bg-[#1a1a1a] rounded-full shadow-inner" />
             <Cpu className="relative z-10 w-6 h-6 text-gray-500" />
          </div>
        );
    }
  };

  return (
    <motion.div 
      initial={false}
      animate={{ 
        left: `${instance.x}%`, 
        top: `${instance.y}%`,
        x: "-50%",
        y: "-50%",
        scale: 0.95 * (boardScale ?? 1)
      }}
      className="absolute z-30 flex flex-col items-center pointer-events-auto transition-shadow group"
    >
      {/* Real Hardware Module Frame */}
      <motion.div
        className="relative w-32 h-36 p-2 bg-orange-500 rounded-[2rem] shadow-2xl border-b-8 border-orange-700"
        whileHover={{ y: -5, scale: 1.05 }}
        onMouseEnter={() => onHover?.(instance)}
        onMouseLeave={() => onHover?.(null)}
      >
        {/* Plus / Swap Component Button */}
        {onSwapClick && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSwapClick(instance.id);
            }}
            className="absolute -top-1.5 -right-1.5 z-[55] w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-black text-lg flex items-center justify-center border-2 border-white shadow-md opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 active:scale-90 hover:scale-110 transition-all duration-200 cursor-pointer"
            title="החלף רכיב / חיישן"
            id={`swap-${instance.id}`}
          >
            +
          </button>
        )}

        {/* Hover Tooltip Bubble */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-[60] -translate-y-2 group-hover:translate-y-0">
           <div className="bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-2xl whitespace-nowrap relative border border-slate-700 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              {instance.name}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-900 rotate-45 border-r border-b border-slate-700" />
           </div>
        </div>

        <div className="w-full h-full bg-slate-50 rounded-[1.75rem] shadow-[inset_0_4px_12px_rgba(0,0,0,0.1)] border-2 border-slate-200 flex flex-col items-center justify-between p-2">
           {/* Central Component Area */}
           <div className="flex-1 w-full flex items-center justify-center">
              {renderSensorElement()}
           </div>

           {/* Value Display / Control Area */}
           {isInput && instance.type !== 'button' ? (
             <div className="w-full px-2 pb-1 z-20 flex flex-col">
                <div className="relative h-6 flex items-center">
                   {/* Physical Slider Track Design - Recessed Slot Effect */}
                   <div className="absolute inset-x-0 h-1.5 bg-slate-300 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] border border-slate-400/10" />
                   <input
                     type="range"
                     min={min}
                     max={max}
                     step={step}
                     value={instance.value}
                     onChange={(e) => {
                       onValueChange?.(Number(e.target.value));
                     }}
                     className="relative z-30 w-full h-6 appearance-none bg-transparent cursor-pointer"
                   />
                </div>
                <div className="flex justify-center -mt-0.5">
                  <span className="text-[11px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md shadow-sm font-mono border border-blue-100">
                    {getDisplayValue()}
                  </span>
                </div>
             </div>
           ) : (
             <div className="w-full flex justify-center pb-1 shrink-0">
                <div className="flex gap-1 opacity-20">
                   {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 bg-slate-800 rounded-full" />)}
                </div>
             </div>
           )}
        </div>
      </motion.div>
      
      {/* Port Label */}
      <div className="mt-2 px-3 py-0.5 bg-slate-800 rounded-full text-[9px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
        {instance.port}
      </div>
    </motion.div>
  );
}
