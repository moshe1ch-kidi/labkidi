import { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ComponentInstance, ComponentType } from '../types';
import ComponentBox from './ComponentBox';
import Microbit from './Microbit';
import { 
  X, 
  Sun, 
  Thermometer, 
  Palette,
  Droplets, 
  RotateCw, 
  Zap, 
  Settings2, 
  Cpu 
} from 'lucide-react';

const AVAILABLE_COMPONENTS = [
  {
    type: 'color_sensor' as const,
    name: 'חיישן זיהוי צבע',
    enName: 'Color Sensor',
    category: 'sensors' as const,
    icon: Palette,
    color: '#ec4899',
    description: 'מזהה צבעים שונים בסביבה (אדום, ירוק, כחול, צהוב ועוד)',
  },
  {
    type: 'light_sensor' as const,
    name: 'חיישן אור (LDR)',
    enName: 'Light Sensor (LDR)',
    category: 'sensors' as const,
    icon: Sun,
    color: '#FFBF00',
    description: 'מזהה ומודד את עוצמת האור בסביבה',
  },
  {
    type: 'temp_sensor' as const,
    name: 'חיישן טמפרטורה אטום למים (DS18B20)',
    enName: 'Waterproof Temperature Sensor (DS18B20)',
    category: 'sensors' as const,
    icon: Thermometer,
    color: '#06b6d4',
    description: 'מודד טמפרטורת מים או סביבה בדיוק רב במעלות צלזיוס',
  },
  {
    type: 'humidity_sensor' as const,
    name: 'חיישן לחות במבנה דחוס',
    enName: 'Humidity Sensor',
    category: 'sensors' as const,
    icon: Droplets,
    color: '#2563eb',
    description: 'מודד לחות יחסית באחוזים %',
  },
  {
    type: 'potentiometer' as const,
    name: 'פוטנציומטר (בורר סיבובי)',
    enName: 'Rotary Potentiometer',
    category: 'sensors' as const,
    icon: RotateCw,
    color: '#06b6d4',
    description: 'כפתור סיבובי ידני לשינוי ערך האנלוגי',
  },
  {
    type: 'button' as const,
    name: 'לחצן מגע (Push Button)',
    enName: 'Push Button',
    category: 'sensors' as const,
    icon: Zap,
    color: '#ec4899',
    description: 'מפסק לחיצה רגעי להפעלה מהירה',
  },
  {
    type: 'switch' as const,
    name: 'מפסק החלקה (Switch)',
    enName: 'Toggle Switch',
    category: 'sensors' as const,
    icon: Settings2,
    color: '#64748b',
    description: 'מפסק השומר על מצב פועל/כבוי קבוע',
  },
  {
    type: 'ultrasonic_sensor' as const,
    name: 'חיישן מרחק אולטרסוני',
    enName: 'Ultrasonic Distance',
    category: 'sensors' as const,
    icon: Cpu,
    color: '#1a4d99',
    description: 'מודד טווח מרחקי מכשולים עד 400 ס"מ',
  },
  {
    type: 'pir_sensor' as const,
    name: 'חיישן תנועה (PIR)',
    enName: 'PIR Motion Sensor',
    category: 'sensors' as const,
    icon: Cpu,
    color: '#10b981',
    description: 'מזהה נוכחות או תנועת אנשים בחדר',
  },
  {
    type: 'red_led' as const,
    name: 'נורת לד אדומה',
    enName: 'Red LED',
    category: 'outputs' as const,
    icon: Zap,
    color: '#ef4444',
    description: 'נורה בצבע אדום רמזור לחייויי אזהרה',
  },
  {
    type: 'yellow_led' as const,
    name: 'נורת לד צהובה',
    enName: 'Yellow LED',
    category: 'outputs' as const,
    icon: Zap,
    color: '#eab308',
    description: 'נורת חיווי צהובה למצבי ביניים',
  },
  {
    type: 'buzzer' as const,
    name: 'רמקול זמזם (Buzzer)',
    enName: 'Main Buzzer',
    category: 'outputs' as const,
    icon: Cpu,
    color: '#a855f7',
    description: 'רכיב שמע לניגון צפצופים ומוזיקה',
  },
  {
    type: 'motor' as const,
    name: 'מנוע מאוורר זרם ישר',
    enName: 'DC Motor Fan',
    category: 'outputs' as const,
    icon: RotateCw,
    color: '#22c55e',
    description: 'מנוע DC מסתובב עם להבי מאוורר צהובים',
  },
  {
    type: 'servo' as const,
    name: 'מנוע סרוו מיקרו',
    enName: 'Micro Servo Motor',
    category: 'outputs' as const,
    icon: RotateCw,
    color: '#ea580c',
    description: 'מנוע סרוו לקביעת זווית מ-0 עד 180 מעלות',
  }
];

interface BoardProps {
  leds: boolean[][];
  components: ComponentInstance[];
  onValueChange: (id: string, value: number) => void;
  onButtonPress: (button: 'A' | 'B') => void;
  onSensorHover?: (instance: ComponentInstance | null) => void;
  onSwapComponent?: (id: string, newType: ComponentType) => void;
}

export default function Board({ leds, components, onValueChange, onButtonPress, onSensorHover, onSwapComponent }: BoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [swappingComponentId, setSwappingComponentId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'sensors' | 'outputs'>('all');
  const [boardScale, setBoardScale] = useState(1);

  useEffect(() => {
    if (!boardRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        // Design target: ~1080px. Bound multiplier between 0.4 and 1.25.
        const scale = Math.max(0.4, Math.min(1.25, width / 1080));
        setBoardScale(scale);
      }
    });
    observer.observe(boardRef.current);
    return () => observer.disconnect();
  }, []);

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
          <rect x="33.5" y="28" width="33" height="44" fill="#1A4D99" opacity="0.4" rx="4" />
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
          animate={{ scale: 0.65 * boardScale, opacity: 1, y: 0 }}
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
              onSwapClick={(id) => setSwappingComponentId(id)}
              boardScale={boardScale}
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

      {/* Animated Component Chooser Modal */}
      {swappingComponentId && (() => {
         const swappingComp = components.find(c => c.id === swappingComponentId);
         if (!swappingComp) return null;
         
         return (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 rounded-[2.5rem]"
              onClick={() => setSwappingComponentId(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-slate-200 overflow-hidden flex flex-col relative max-h-[95%] text-right text-slate-800"
                dir="rtl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header Section */}
                <div className="bg-slate-50 p-4 border-b-2 border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                         🔄
                      </div>
                      <div className="text-right">
                         <h3 className="text-lg font-black text-slate-800 leading-tight">החלפת רכיב בחיבור {swappingComp.port}</h3>
                         <p className="text-xs font-bold text-slate-400">בחר רכיב מהרשימה שלהלן כדי לחבר אותו ללוח המיקרוביט</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => setSwappingComponentId(null)}
                     className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                   >
                     <X className="w-6 h-6" />
                   </button>
                </div>

                {/* Subheader tabs */}
                <div className="p-3 bg-slate-100 flex gap-2 border-b border-slate-200 shrink-0">
                   <button
                     onClick={() => setCategoryFilter('all')}
                     className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${
                       categoryFilter === 'all' 
                         ? 'bg-blue-600 text-white shadow-md' 
                         : 'bg-white text-slate-600 hover:bg-slate-200'
                     }`}
                   >
                     הכל ({AVAILABLE_COMPONENTS.length})
                   </button>
                   <button
                     onClick={() => setCategoryFilter('sensors')}
                     className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${
                       categoryFilter === 'sensors' 
                         ? 'bg-blue-600 text-white shadow-md' 
                         : 'bg-white text-slate-600 hover:bg-slate-200'
                     }`}
                   >
                     חיישנים וקלט
                   </button>
                   <button
                     onClick={() => setCategoryFilter('outputs')}
                     className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${
                       categoryFilter === 'outputs' 
                         ? 'bg-blue-600 text-white shadow-md' 
                         : 'bg-white text-slate-600 hover:bg-slate-200'
                     }`}
                   >
                     רכיבי פלט ומנועים
                   </button>
                </div>

                {/* Grid Item Selector List */}
                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 bg-slate-50 min-h-[250px] max-h-[380px]">
                   {AVAILABLE_COMPONENTS.filter(item => categoryFilter === 'all' || item.category === categoryFilter).map((compItem) => {
                      const Icon = compItem.icon;
                      const isCurrent = swappingComp.type === compItem.type;
                      const mountedInstances = components.filter(c => c.type === compItem.type);
                      const isOnTheBoard = mountedInstances.length > 0;
                      
                      return (
                         <button
                           key={compItem.type}
                           onClick={() => {
                             if (onSwapComponent) {
                               onSwapComponent(swappingComp.id, compItem.type);
                             }
                             setSwappingComponentId(null);
                           }}
                           className={`p-3 text-right rounded-2xl border-2 flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group shadow-sm hover:shadow-md cursor-pointer relative ${
                             isCurrent 
                               ? 'border-emerald-500 bg-emerald-50/60' 
                               : isOnTheBoard 
                               ? 'border-amber-400 bg-amber-50/40 hover:border-amber-500' 
                               : 'border-dashed border-slate-300 bg-white hover:border-slate-400'
                           }`}
                         >
                            {/* Status Indicator Badge */}
                            <div className="absolute top-2 left-2 flex gap-1 items-center z-10">
                              {isCurrent ? (
                                <div className="bg-emerald-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                                   <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping shrink-0" />
                                   מחובר כאן ({swappingComp.port})
                                </div>
                              ) : isOnTheBoard ? (
                                <div className="bg-amber-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm">
                                   על הלוח ({mountedInstances.map(m => m.port).join(', ')})
                                </div>
                              ) : (
                                <div className="bg-slate-200 text-slate-500 border border-slate-300 text-[8px] font-black px-2 py-0.5 rounded-full">
                                   לא על הלוח
                                </div>
                              )}
                            </div>

                            <div 
                              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm transition-transform group-hover:rotate-12"
                              style={{ 
                                backgroundColor: `${compItem.color}15`, 
                                color: compItem.color,
                                borderColor: `${compItem.color}30` 
                              }}
                            >
                               <Icon className="w-5 h-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                               <h4 className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors truncate">{compItem.name}</h4>
                               <p className="text-[10px] text-slate-400 font-bold font-sans mt-0.5 uppercase tracking-wide truncate">{compItem.enName}</p>
                               <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">{compItem.description}</p>
                            </div>
                         </button>
                      );
                   })}
                </div>
              </motion.div>
            </motion.div>
         );
      })()}
    </div>
  );
}
