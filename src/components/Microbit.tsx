import { motion } from 'motion/react';

interface MicrobitProps {
  leds: boolean[][];
  onButtonPress?: (button: 'A' | 'B') => void;
}

export default function Microbit({ leds, onButtonPress }: MicrobitProps) {
  return (
    <div id="microbit-hardware" className="relative w-[480px] h-[520px] drop-shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
      <svg
        viewBox="0 0 600 650"
        className="w-full h-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Expansion Shield - Back Plate (Behind Microbit) */}
        <g id="shield-back" transform="translate(70, 315)">
          <rect x="0" y="0" width="460" height="45" rx="5" fill="#050505" />
          <rect x="5" y="5" width="450" height="35" rx="3" fill="#000" />
        </g>

        {/* Microbit Board - Positioned on Top */}
        <g id="microbit-core" transform="translate(70, 20)">
          {/* Main Board Body */}
          <rect x="0" y="0" width="460" height="400" rx="35" fill="#1a1a1a" />
          <rect x="5" y="5" width="450" height="390" rx="30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

          {/* Top-Left Silk Screen Pattern */}
          <path
            d="M 0 35 Q 0 0 35 0 L 220 0 L 180 40 L 160 20 L 120 60 L 100 30 L 0 140 Z"
            fill="#4affaa"
            className="drop-shadow-[0_0_8px_rgba(74,255,170,0.3)]"
          />

          {/* Buzzer (Piezo Speaker) on the Green Area */}
          <g id="buzzer" transform="translate(65, 45)">
            {/* Main Body Shadow */}
            <circle cx="0" cy="2" r="32" fill="rgba(0,0,0,0.4)" />
            {/* Main Body - Slightly lighter for better contrast */}
            <circle cx="0" cy="0" r="32" fill="#333" />
            <circle cx="0" cy="0" r="30" fill="#444" stroke="#222" strokeWidth="1" />
            
            {/* Top Surface Texture */}
            <circle cx="0" cy="0" r="28" fill="url(#buzzerGradient)" opacity="0.6" />
            <defs>
              <radialGradient id="buzzerGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#666" />
                <stop offset="60%" stopColor="#444" />
                <stop offset="100%" stopColor="#222" />
              </radialGradient>
            </defs>

            {/* Sound Holes Pattern - Pure Black for depth */}
            <g transform="translate(-13, -13)">
               {/* Center hole */}
               <circle cx="13" cy="13" r="4.5" fill="#000" />
               {/* Outer holes */}
               {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                  <circle 
                    key={i}
                    cx={13 + Math.cos(angle * Math.PI / 180) * 12} 
                    cy={13 + Math.sin(angle * Math.PI / 180) * 12} 
                    r="3" 
                    fill="#000" 
                  />
               ))}
               {/* Inner holes */}
               {[30, 90, 150, 210, 270, 330].map((angle, i) => (
                  <circle 
                    key={`inner-${i}`}
                    cx={13 + Math.cos(angle * Math.PI / 180) * 7} 
                    cy={13 + Math.sin(angle * Math.PI / 180) * 7} 
                    r="2" 
                    fill="#000" 
                  />
               ))}
            </g>
            
            {/* Highlight ring for metallic feel */}
            <circle cx="0" cy="0" r="26" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          </g>

          {/* Center Logo/Mic Assembly */}
          <rect x="195" y="45" width="70" height="35" rx="20" fill="#121212" stroke="#4affaa" strokeWidth="4" />
          <circle cx="218" cy="62.5" r="5" fill="#4affaa" className="shadow-lg" />
          <circle cx="242" cy="62.5" r="7" fill="#121212" stroke="#4affaa" strokeWidth="2.5" />

          {/* Silk Screen Label */}
          <text x="230" y="105" textAnchor="middle" fill="white" fillOpacity="0.2" fontSize="10" fontWeight="900" letterSpacing="0.4em">
            micro:bit
          </text>

          {/* LED Matrix Background Grid */}
          <g id="led-matrix">
             {leds.map((row, y) => 
               row.map((active, x) => (
                  <g key={`led-${x}-${y}`} transform={`translate(${175 + x * 25}, ${106 + y * 30})`}>
                     {/* Housing - White when unlit */}
                     <rect x="0" y="0" rx="2" width="10" height="18" fill="#f8fafc" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                     {/* Light Surface */}
                     {active && (
                       <motion.rect
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          x="0" y="0" rx="2" width="10" height="18"
                          fill="#ff1111"
                          className="drop-shadow-[0_0_15px_rgba(255,17,17,1)]"
                       />
                     )}
                  </g>
               ))
             )}
          </g>

          {/* Button A Assembly */}
          <g id="button-a" transform="translate(30, 150)" cursor="pointer" onMouseDown={() => onButtonPress?.('A')}>
            {/* Housing */}
            <rect width="70" height="70" rx="12" fill="#3a3a3a" fillOpacity="0.95" />
            <rect x="3.5" y="3.5" width="63" height="63" rx="10" fill="#111" stroke="black" strokeWidth="1" />
            <circle cx="35" cy="35" r="18" fill="#2a2a2a" stroke="black" strokeWidth="2" />
            <circle cx="35" cy="35" r="10" fill="#111" />
            
            {/* Triangle Label A */}
            <path d="M -5 75 L 25 75 L 25 45 Z" fill="#4affaa" />
            <text x="12" y="72" fontSize="18" fontWeight="900" fill="black">A</text>
          </g>

          {/* Button B Assembly */}
          <g id="button-b" transform="translate(360, 150)" cursor="pointer" onMouseDown={() => onButtonPress?.('B')}>
            {/* Housing */}
            <rect width="70" height="70" rx="12" fill="#3a3a3a" fillOpacity="0.8" />
            <rect x="3.5" y="3.5" width="63" height="63" rx="10" fill="#111" stroke="black" strokeWidth="1" />
            <circle cx="35" cy="35" r="18" fill="#2a2a2a" stroke="black" strokeWidth="2" />
            <circle cx="35" cy="35" r="10" fill="#111" />
            
            {/* Triangle Label B */}
            <path d="M 75 -5 L 45 -5 L 75 25 Z" fill="#4affaa" />
            <text x="58" y="14" fontSize="18" fontWeight="900" fill="black">B</text>
          </g>

          {/* Bottom Edge Connector Pad */}
          <g id="pins" transform="translate(0, 300)">
             {/* Metallic Strip Background */}
             <rect width="460" height="100" rx="0 0 35 35" fill="#d4af37" />
             <rect width="460" height="5" fill="rgba(0,0,0,0.2)" />
             
             {/* Vertical Separator Stripes */}
             <g opacity="0.4">
               {Array.from({length: 70}).map((_, i) => (
                  <rect key={i} x={i * 6.57} y="5" width="1.5" height="95" fill="#b45309" />
               ))}
             </g>

             {/* Circular Contact Pads and Labels */}
             {[
               { name: '0', x: 45 },
               { name: '1', x: 137.5 },
               { name: '2', x: 230 },
               { name: '3V', x: 322.5 },
               { name: 'GND', x: 415 }
             ].map((pin) => (
               <g key={pin.name}>
                  <circle cx={pin.x} cy="40" r="24" fill="white" className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <circle cx={pin.x} cy="40" r="22" fill="#f8fafc" />
                  <text x={pin.x} y="85" textAnchor="middle" fill="#422006" fontSize="20" fontWeight="900" fontFamily="monospace">
                     {pin.name}
                  </text>
               </g>
             ))}
          </g>

          {/* Mounting Holes */}
          <circle cx="45" cy="45" r="12" fill="#000" />
          <circle cx="415" cy="45" r="12" fill="#000" />
        </g>

        {/* Expansion Shield Base (Breakout Mini) - Positioned at the bottom, overlapping pins */}
        <g id="shield-base" transform="translate(30, 440)">
          {/* Black PCB (Lower Plate) */}
          <rect x="0" y="0" width="540" height="180" rx="40" fill="#121212" />
          <rect x="5" y="5" width="530" height="170" rx="35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          
          <text x="500" y="160" textAnchor="end" fill="white" fillOpacity="0.5" fontSize="18" fontWeight="bold">m:bit Breakout Mini</text>
          
          {/* Mounting Holes */}
          <circle cx="50" cy="130" r="20" fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="4" />
          <circle cx="50" cy="130" r="16" fill="#121212" />
          <circle cx="490" cy="70" r="15" fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="4" />
          <circle cx="490" cy="70" r="12" fill="#121212" />

          {/* Red Connector Slot (Front Piece) */}
          <g id="red-slot" transform="translate(35, -125)">
             {/* Expansion Shadow underneath the slot on the red PCB - Expanded for depth */}
             <rect x="-60" y="130" width="600" height="120" rx="40" fill="url(#shadowGradient)" />
             <defs>
               <linearGradient id="shadowGradient" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor="black" stopOpacity="0.7" />
                 <stop offset="60%" stopColor="black" stopOpacity="0.3" />
                 <stop offset="100%" stopColor="black" stopOpacity="0" />
               </linearGradient>
             </defs>

             {/* Main Red Housing */}
             <rect x="-10" y="0" width="490" height="130" rx="6" fill="#DC2626" />
             <rect x="-8" y="2" width="486" height="126" rx="5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
             
             {/* The Metallic Pins/Teeth */}
             <g id="metallic-teeth">
               {Array.from({length: 48}).map((_, i) => (
                  <g key={`tooth-${i}`} transform={`translate(${i * 9.8}, 20)`}>
                    <rect x="0" y="0" width="4.5" height="100" fill="#222" />
                    <rect x="1" y="0" width="3" height="100" fill="url(#silverPinGradient)" rx="1" />
                    <rect x="1.5" y="0" width="1" height="100" fill="white" fillOpacity="0.4" rx="0.5" />
                  </g>
               ))}
             </g>


             <defs>
               <linearGradient id="silverPinGradient" x1="0" y1="0" x2="1" y2="0">
                 <stop offset="0%" stopColor="#94a3b8" />
                 <stop offset="50%" stopColor="#f1f5f9" />
                 <stop offset="100%" stopColor="#64748b" />
               </linearGradient>
             </defs>
          </g>

          {/* Output Pads */}
          <g id="output-pads" transform="translate(180, 110)">
             {[0, 1, 2, 8, 12, 13, 14, 15, 16, 'SCL', 'SDA', '3V', 'GND'].map((pin, i) => (
                <g key={`pin-${pin}`} transform={`translate(${i * 24}, 0)`}>
                   <circle cx="0" cy="10" r="8" fill="#121212" stroke="#d4af37" strokeWidth="2" />
                   <text x="0" y="-8" textAnchor="middle" fill="white" fillOpacity="0.6" fontSize="10" fontWeight="bold">{pin}</text>
                </g>
             ))}
          </g>
        </g>
      </svg>

    </div>
  );
}
