import { useState } from 'react';
import { Delete, Check } from 'lucide-react';

interface NumericKeypadProps {
  onValueSelected: (value: string) => void;
  onClose: () => void;
  initialValue: string;
  position: { x: number, y: number };
  color: string;
}

export default function NumericKeypad({ onValueSelected, onClose, initialValue, position, color }: NumericKeypadProps) {
  const [value, setValue] = useState(initialValue);

  const handleKeyPress = (key: string) => {
    if (key === 'C') {
        setValue('');
    } else if (key === 'DEL') {
        setValue(prev => prev.slice(0, -1));
    } else if (key === '.') {
        if (!value.includes('.')) setValue(prev => prev + key);
    } else {
        setValue(prev => prev + key);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/5 backdrop-blur-[1px]" onClick={onClose}>
      <div 
        className="absolute p-2 rounded-2xl shadow-2xl border-4 w-36"
        style={{ 
          top: `${position.y + 10}px`, 
          left: `${position.x}px`,
          borderColor: color,
          background: 'white'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900 p-1 mb-2 rounded-lg text-right text-lg font-mono h-8 flex items-center justify-end px-2" style={{ color: color }}>
          {value || '0'}
        </div>
        <div className="grid grid-cols-3 gap-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'AC', '0', '.'].map((key, index) => {
            const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6', '#f43f5e', '#a3e635', '#f59e0b', '#06b6d4'];
            const keyColor = colors[index % colors.length];
            const isAC = key === 'AC';
            return (
              <button
                key={key}
                onClick={() => handleKeyPress(isAC ? 'C' : key)}
                className={`p-1.5 border rounded-lg text-base font-bold hover:border-2 transition-colors ${isAC ? 'bg-red-50 text-red-600' : 'bg-white'}`}
                style={{
                  borderColor: keyColor,
                  color: isAC ? '#ef4444' : keyColor,
                  backgroundColor: isAC ? '#fef2f2' : `${keyColor}10`
                }}
              >
                {key}
              </button>
            );
          })}
          <button onClick={() => handleKeyPress('DEL')} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center"><Delete size={16} /></button>
          <button onClick={() => { onValueSelected(value); onClose(); }} className="col-span-2 p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center"><Check size={16} /></button>
        </div>
      </div>
    </div>
  );
}
