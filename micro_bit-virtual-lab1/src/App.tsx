import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Square, RefreshCcw, Info, Maximize2, Minimize2 } from 'lucide-react';
import { INITIAL_COMPONENTS } from './constants';
import { ComponentInstance } from './types';
import Board from './components/Board';
import BlocklyEditor, { BlocklyEditorRef } from './components/BlocklyEditor';

export default function App() {
  const [components, setComponents] = useState<ComponentInstance[]>(INITIAL_COMPONENTS);
  const [leds, setLeds] = useState<boolean[][]>(Array(5).fill(null).map(() => Array(5).fill(false)));
  const [hoveredSensorId, setHoveredSensorId] = useState<string | null>(null);
  const hoveredSensor = components.find(c => c.id === hoveredSensorId) || null;
  const [isRunning, setIsRunning] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  
  const componentsRef = useRef<ComponentInstance[]>(components);
  useEffect(() => {
    componentsRef.current = components;
  }, [components]);
  
  const editorRef = useRef<BlocklyEditorRef>(null);
  const runState = useRef<{ isRunning: boolean }>({ isRunning: false });

  const handleValueChange = (id: string, value: number) => {
    setComponents(prev => prev.map(c => c.id === id ? { ...c, value } : c));
  };

  const handleSensorHover = (instance: ComponentInstance | null) => {
    setHoveredSensorId(instance ? instance.id : null);
  };

  const stopSimulation = useCallback(() => {
    setIsRunning(false);
    runState.current.isRunning = false;
    // Clear highlight
    editorRef.current?.highlightBlock(null);
    // Clear all intervals/timeouts from eval
    const highestId = window.setTimeout(() => {});
    for (let i = 0; i < highestId; i++) {
      window.clearTimeout(i);
      window.clearInterval(i);
    }
  }, []);

  const runSimulation = useCallback(async () => {
    stopSimulation();
    setIsRunning(true);
    runState.current.isRunning = true;

    // Define the hardware API for the sandboxed simulation
    const microbit = {
      showString: async (text: string) => {
        console.log("Showing string:", text);
        for (const char of String(text)) {
          if (!runState.current.isRunning) break;
          // Simple visualization: light up all LEDs briefly
          setLeds(prev => prev.map(row => row.map(() => true)));
          await new Promise(r => setTimeout(r, 200));
          setLeds(prev => prev.map(row => row.map(() => false)));
          await new Promise(r => setTimeout(r, 100));
        }
      },
      digitalWrite: (port: string, value: number) => {
        setComponents(prev => prev.map(c => c.port === port ? { ...c, value: Number(value) } : c));
      },
      analogRead: (port: string) => {
        const comp = componentsRef.current.find(c => c.port === port);
        return comp ? comp.value : 0;
      },
      digitalRead: (port: string) => {
        const comp = componentsRef.current.find(c => c.port === port);
        return comp ? comp.value : 0;
      },
      ultrasonicRead: (triggerPort: string, echoPort: string) => {
        const comp = componentsRef.current.find(c => c.type === 'ultrasonic_sensor');
        return comp ? comp.value : 0;
      },
      temperature: () => {
        const comp = componentsRef.current.find(c => c.type === 'temp_sensor');
        return comp ? comp.value : 25; // Default temp
      },
      lightLevel: () => {
        const comp = componentsRef.current.find(c => c.type === 'light_sensor');
        return comp ? comp.value : 0;
      },
      acceleration: (dim: string) => {
        return 0; // Not currently simulated
      },
      onButtonPressed: (button: string, callback: Function) => {
        console.log(`Subscribed to button ${button}`);
      },
      highlightBlock: (id: string | null) => {
        editorRef.current?.highlightBlock(id);
      },
      playTone: async (frequency: number, duration: number) => {
        console.log(`Playing tone: ${frequency}Hz for ${duration}ms`);
        
        // Use Web Audio API to play a real sound
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const context = new AudioContextClass();
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();

            oscillator.type = 'square'; // Buzzier sound
            oscillator.frequency.setValueAtTime(frequency, context.currentTime);
            
            gainNode.gain.setValueAtTime(0.1, context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration / 1000);

            oscillator.connect(gainNode);
            gainNode.connect(context.destination);

            oscillator.start();
            oscillator.stop(context.currentTime + duration / 1000);
            
            // Clean up context after sound finishes
            setTimeout(() => {
              context.close();
            }, duration + 100);
          }
        } catch (e) {
          console.error("Audio Context Error:", e);
        }

        // Visual indicator on the buzzer
        setComponents(prev => prev.map(c => c.type === 'buzzer' ? { ...c, value: 1 } : c));
        await new Promise(r => setTimeout(r, duration));
        setComponents(prev => prev.map(c => c.type === 'buzzer' ? { ...c, value: 0 } : c));
      },
      setMotorSpeed: async (speed: number) => {
        console.log(`Setting motor speed to: ${speed}`);
        setComponents(prev => prev.map(c => c.type === 'motor' ? { ...c, value: speed } : c));
      },
      setServoAngle: async (angle: number) => {
        console.log(`Setting servo angle to: ${angle}`);
        setComponents(prev => prev.map(c => c.type === 'servo' ? { ...c, value: angle } : c));
      },
      setLedState: async (color: 'red' | 'yellow', state: number) => {
        console.log(`Setting ${color} LED state to: ${state}`);
        const type = color === 'red' ? 'red_led' : 'yellow_led';
        setComponents(prev => prev.map(c => c.type === type ? { ...c, value: state } : c));
      }
    };

    try {
      // Create a safely wrapped async environment
      const asyncCode = `(async () => { 
        try {
          const highlightBlock = (id) => {
            microbit.highlightBlock(id);
          };
          ${editorRef.current?.getCodeForSimulation()}
        } catch (e) {
          console.error('Execution error:', e);
        }
      })()`;
      
      const fn = new Function('microbit', 'console', asyncCode);
      fn(microbit, console);
    } catch (err) {
      console.error("Simulation Start Error:", err);
      stopSimulation();
    }
  }, [currentCode, components, stopSimulation]);

  const handleButtonPress = (button: 'A' | 'B') => {
    console.log(`Button ${button} pressed`);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f3f7ff] text-slate-800 font-sans">
      <header className="h-20 bg-white border-b-4 border-[#e2e8f0] flex items-center justify-between px-8 shrink-0 z-30 shadow-sm relative">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-[#4ade80] rounded-2xl flex items-center justify-center text-white shadow-[0_4px_0_#16a34a] border-2 border-white">
               <RefreshCcw className="w-7 h-7" />
             </div>
             <div>
               <h1 className="text-2xl font-black tracking-tight text-[#1e293b] leading-none">STACK<span className="text-[#3b82f6]">KIDI</span> <span className="text-[#f59e0b]">LAB</span></h1>
               <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-[#94a3b8]'}`} />
                  <p className="text-[11px] text-[#64748b] font-bold uppercase tracking-wider">{isRunning ? 'Running...' : 'Ready!'}</p>
               </div>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex gap-3">
            {isRunning ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={stopSimulation}
                className="flex items-center gap-3 px-8 py-3 bg-[#f87171] text-white rounded-[1.25rem] text-sm font-black shadow-[0_6px_0_#dc2626] border-2 border-white transition-all"
              >
                <Square className="w-4 h-4 fill-current" /> STOP
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={runSimulation}
                className="flex items-center gap-3 px-6 py-3 bg-[#4ade80] text-white rounded-[1.25rem] text-sm font-black shadow-[0_6px_0_#16a34a] border-2 border-white transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4ade80" className="w-4 h-4">
                    <path d="M6 3v18h2v-7h10l-2-5 2-5H6z"/>
                  </svg>
                </div>
                RUN
              </motion.button>
            )}
          </div>
          
          <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-blue-500 hover:bg-blue-100 cursor-pointer shadow-sm transition-all">
            <Info className="w-6 h-6" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
         <section className={`${isEditorExpanded ? 'w-[70%]' : 'w-[40%]'} h-full flex flex-col bg-white border-r-4 border-[#e2e8f0] z-40 transition-all duration-300`}>
          <div className="h-16 border-b-4 border-[#f1f5f9] flex items-center justify-between px-8 shrink-0 bg-[#f8fafc]">
             <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                <span className="text-sm font-black text-[#1e293b] uppercase tracking-wider">Workspace</span>
             </div>
             <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditorExpanded(!isEditorExpanded)}
                  className="p-3 bg-[#e2e8f0] hover:bg-slate-300 rounded-2xl text-[#1e293b] transition-all duration-300"
                  title={isEditorExpanded ? 'Collapse Editor' : 'Expand Editor'}
                >
                  {isEditorExpanded ? <Minimize2 className="w-8 h-8" /> : <Maximize2 className="w-8 h-8" />}
                </button>
                <div className="w-3 h-3 rounded-full bg-[#e2e8f0]" />
                <div className="w-3 h-3 rounded-full bg-[#e2e8f0]" />
                <div className="w-3 h-3 rounded-full bg-[#e2e8f0]" />
             </div>
          </div>
          <div className="flex-1">
            <BlocklyEditor ref={editorRef} onCodeChange={setCurrentCode} isRunning={isRunning} />
          </div>
        </section>

        <section className={`${isEditorExpanded ? 'hidden' : 'w-[60%]'} h-full px-6 py-4 flex flex-col overflow-y-auto bg-[#f8fafc] relative transition-all duration-300`}>
          {/* Playful environment background */}
          <div className="absolute inset-0 opacity-[0.2] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#94a3b8 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
          
          <div className="flex-1 min-h-0 z-10 flex items-center justify-center">
             <div className="w-full h-full max-w-full flex items-center justify-center">
                <Board 
                   leds={leds} 
                   components={components} 
                   onValueChange={handleValueChange} 
                   onButtonPress={handleButtonPress}
                   onSensorHover={handleSensorHover}
                />
             </div>
          </div>
          
          <div className="mt-2 grid grid-cols-3 gap-4 shrink-0 z-20">
             <div className="bg-white p-2 rounded-[1.5rem] border-4 border-[#bae6fd] shadow-md">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-6 h-6 rounded-full bg-[#bae6fd] flex items-center justify-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                   </div>
                   <h2 className="text-[10px] font-black text-[#0369a1] uppercase tracking-widest font-mono">System</h2>
                </div>
                <div className="flex items-baseline gap-2">
                   <span className={`text-xl font-black ${isRunning ? 'text-[#10b981]' : 'text-slate-300'}`}>
                     {isRunning ? "ACTIVE" : "IDLE"}
                   </span>
                </div>
             </div>

             <div className="bg-white p-2 rounded-[1.5rem] border-4 border-[#fed7aa] shadow-md">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-6 h-6 rounded-full bg-[#fed7aa] flex items-center justify-center">
                      <div className="w-3 h-3 bg-orange-500 rounded-full rotate-45" />
                   </div>
                   <h2 className="text-[10px] font-black text-[#9a3412] uppercase tracking-widest font-mono">
                      {hoveredSensor ? 'Sensor Data' : 'Sensors'}
                   </h2>
                </div>
                <div className="flex items-baseline gap-2">
                   <span className="text-xl font-black text-[#f59e0b]">
                     {hoveredSensor ? hoveredSensor.name : components.filter(c => c.value > 0).length}
                   </span>
                   <span className="text-sm font-bold text-slate-300">
                     {hoveredSensor ? `: ${hoveredSensor.value}` : `/ ${components.length}`}
                   </span>
                </div>
             </div>

             <div className="bg-white p-2 rounded-[1.5rem] border-4 border-[#fecdd3] shadow-md">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-6 h-6 rounded-full bg-[#fecdd3] flex items-center justify-center">
                      <div className="w-3 h-3 bg-rose-500 rounded-sm" />
                   </div>
                   <h2 className="text-[10px] font-black text-[#9f1239] uppercase tracking-widest font-mono">Voltage</h2>
                </div>
                <div className="text-2xl font-black text-[#e11d48]">3.3V <span className="text-xs font-bold text-slate-300 ml-1">OK</span></div>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
