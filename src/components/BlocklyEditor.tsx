 import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import * as Blockly from 'blockly';
import 'blockly/blocks';
import { defineBlocks, toolbox, COLORS } from '../lib/blocklyConfig';
import { javascriptGenerator } from 'blockly/javascript';
import NumericKeypad from './NumericKeypad';
import { NumericField } from '../lib/NumericField';

// Import icons
import MoistureIcon from '@icons/Moisture.png';
import PotentiometerIcon from '@icons/Potentiometer-1.png';
import PushIcon from '@icons/push-1.png';
import UltrasonicIcon from '@icons/ultrasonic-1.png';
import LDRIcon from '@icons/ldr.png';
import VarIcon from '@icons/var.png';
import MathIcon from '@icons/math.png';
import OutputIcon from '@icons/output-1.png';
import MotorIcon from '@icons/motor.png';
import ServoIcon from '@icons/servo.png';
import LedIcon from '@icons/led.png';
import BuzzerIcon from '@icons/buzzer.png';
import ForeverIcon from '@icons/forever.png';
import WaitIcon from '@icons/wait.png';
import RepeatIcon from '@icons/repeat.png';

interface BlocklyEditorProps {
  onCodeChange?: (code: string) => void;
  isRunning?: boolean;
}

export interface BlocklyEditorRef {
  highlightBlock: (id: string | null) => void;
  getCodeForSimulation: () => string;
}

// Register the custom field class
Blockly.fieldRegistry.register('field_numeric', NumericField);

// Define the ZOLO design style theme
const ZoloTheme = Blockly.Theme.defineTheme('zolo', {
  'name': 'zolo',
  'base': Blockly.Themes.Classic,
  'componentStyles': {
    'workspaceBackgroundColour': '#F0F4F8',
    'toolboxBackgroundColour': '#FFFFFF',
    'flyoutBackgroundColour': '#F8FAFC',
    'scrollbarColour': '#E2E8F0',
    'scrollbarOpacity': 0.6,
    'insertionMarkerColour': '#FFD93D',
    'insertionMarkerOpacity': 0.3,
    'cursorColour': '#4F46E5',
  },
  'fontStyle': {
    'family': '"Outfit", "Fredoka", sans-serif',
    'weight': '600',
    'size': 13
  },
  'blockStyles': {
    'logic_blocks': { 'colourPrimary': COLORS.OPERATORS, 'colourSecondary': '#FFC733', 'colourTertiary': '#CC8800' },
    'loop_blocks': { 'colourPrimary': COLORS.CONTROL, 'colourSecondary': '#FFC733', 'colourTertiary': '#CC8800' },
    'math_blocks': { 'colourPrimary': COLORS.MATH, 'colourSecondary': '#70D070', 'colourTertiary': '#3D733D' },
    'text_blocks': { 'colourPrimary': COLORS.OUTPUT, 'colourSecondary': '#B899FF', 'colourTertiary': '#5E3DD9' },
    'variable_blocks': { 'colourPrimary': '#8B5CF6', 'colourSecondary': '#A78BFA', 'colourTertiary': '#5B21B6' },
    'procedure_blocks': { 'colourPrimary': '#EF4444', 'colourSecondary': '#F87171', 'colourTertiary': '#991B1B' },
    'list_blocks': { 'colourPrimary': '#3B82F6', 'colourSecondary': '#60A5FA', 'colourTertiary': '#1E40AF' }
  },
  'categoryStyles': {
    'basic_category': { 'colour': COLORS.CONTROL }, // Control
    'sensor_category': { 'colour': COLORS.SENSOR }, // Sensor
    'output_category': { 'colour': COLORS.OUTPUT }, // Output
    'input_category': { 'colour': COLORS.CONTROL },  // Input/Events (merged or removed)
    'logic_category': { 'colour': COLORS.OPERATORS },  // Operators/Control
    'math_category': { 'colour': COLORS.MATH }    // Math
  }
});

export default forwardRef<BlocklyEditorRef, BlocklyEditorProps>(({ onCodeChange, isRunning }, ref) => {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const [keypad, setKeypad] = useState<{
    visible: boolean;
    initialValue: string;
    onCallback: (value: string) => void;
    position: { x: number, y: number };
    color: string;
  } | null>(null);

  const [promptDialog, setPromptDialog] = useState<{
    visible: boolean;
    message: string;
    defaultValue: string;
    callback: (value: string | null) => void;
  } | null>(null);

  useEffect(() => {
    NumericField.onTrigger = (field: NumericField, initialValue: string, callback: (value: string) => void) => {
      // Get position
      const rect = field.getSvgRoot().getBoundingClientRect();
      // Get block color
      const color = field.getSourceBlock()?.getColour() || '#FFAB19';
      
      setKeypad({ 
        visible: true, 
        initialValue, 
        onCallback: callback,
        position: { x: rect.left, y: rect.top },
        color
      });
    };
  }, []);

  useImperativeHandle(ref, () => ({
    highlightBlock: (id: string | null) => {
      workspaceRef.current?.highlightBlock(id);
    },
    getCodeForSimulation: () => {
      const oldPrefix = javascriptGenerator.STATEMENT_PREFIX;
      javascriptGenerator.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
      const code = javascriptGenerator.workspaceToCode(workspaceRef.current!);
      javascriptGenerator.STATEMENT_PREFIX = oldPrefix;
      return code;
    }
  }));

  useEffect(() => {
    if (!blocklyDiv.current) return;

    if (!workspaceRef.current) {
      defineBlocks({ 
        moisture: MoistureIcon, 
        ultrasonic: UltrasonicIcon, 
        potentiometer: PotentiometerIcon, 
        ldr: LDRIcon, 
        push: PushIcon,
        motor: MotorIcon,
        servo: ServoIcon,
        led: LedIcon,
        buzzer: BuzzerIcon,
        forever: ForeverIcon,
        wait: WaitIcon,
        repeat: RepeatIcon
      });
      workspaceRef.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolbox,
        theme: ZoloTheme,
        grid: { spacing: 40, length: 2, colour: '#DDE2E7', snap: true },
        zoom: { controls: true, wheel: true, startScale: 0.9, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2 },
        trashcan: true,
        renderer: 'zelos',
      });
      // Variables need to be initialized after workspace creation, not via inject option in this specific configuration
      workspaceRef.current.createVariable('myVariable');

      // Override Blockly default prompts to work in an iframe
      Blockly.dialog.setPrompt((message, defaultValue, callback) => {
        setPromptDialog({ visible: true, message, defaultValue, callback });
      });

      workspaceRef.current.addChangeListener(() => {
        const code = javascriptGenerator.workspaceToCode(workspaceRef.current!);
        onCodeChange?.(code);
      });
    }

    // Inject category-specific colors and icons
    const style = document.createElement('style');
    style.textContent = `
      /* ניקוי איקונים מקוריים של בוקלי */
      .blocklyTreeIcon {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
      }
 
      /* עיצוב השורה עצמה */
      .blocklyTreeRow {
        height: 100px !important;
        width: 100px !important;
        margin: 10px auto !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 16px !important;
        position: relative !important;
        cursor: pointer !important;
        border: 4px solid transparent !important;
        box-sizing: border-box !important;
        padding: 0 !important;
        overflow: hidden !important;
      }
 
      /* תיקון קריטי למרכז האלמנטים הפנימיים - הוספת כפייה על כיוון התוכן */
      .blocklyTreeRowContent {
        display: flex !important;
        flex-direction: column !important; /* איקון מעל טקסט */
        align-items: center !important;    /* מרכוז אופקי מושלם */
        justify-content: center !important; /* מרכוז אנכי מושלם */
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        text-indent: 0 !important;
        text-align: center !important;
        pointer-events: none !important;
        box-sizing: border-box !important;
      }
 
      /* עיצוב ומרכוז אגרסיבי של הטקסט */
      .blocklyTreeLabel {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        font-size: 11px !important;
        font-family: inherit !important;
        text-align: center !important;     /* מרכוז הטקסט בפנים */
        pointer-events: none !important;
        margin: 6px 0 0 0 !important;      /* רווח מעל, איפוס בצדדים */
        padding: 0 !important;             /* איפוס הריפוד של בוקלי שמזיז הצידה! */
        padding-left: 0 !important;        /* דריסת הגדרות מקוריות ספציפיות */
        padding-right: 0 !important;       /* דריסת הגדרות מקוריות ספציפיות */
        text-indent: 0 !important;         /* מניעת הזחה */
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        flex-shrink: 0 !important;
        box-sizing: border-box !important;
      }
      .cat-bg-control .blocklyTreeLabel { color: #A06000 !important; }
      .cat-bg-sensor .blocklyTreeLabel { color: #005680 !important; }
      .cat-bg-output .blocklyTreeLabel { color: #4B0082 !important; }
      .cat-bg-math .blocklyTreeLabel { color: #006400 !important; }
      .cat-bg-logic .blocklyTreeLabel { color: #A06000 !important; }
      .cat-bg-variables .blocklyTreeLabel { color: #4B0082 !important; }
 
      /* עיצוב האיקונים */
      .cat-icon-control,
      .cat-icon-sensor,
      .cat-icon-output,
      .cat-icon-math,
      .cat-icon-logic,
      .cat-icon-variables {
        display: block !important;
        width: 45px !important;
        height: 45px !important;
        margin: 0 auto !important;         /* מרכוז אופקי מובטח של בלוק האיקון */
        background-repeat: no-repeat !important;
        background-position: center !important;
        background-size: contain !important;
        flex-shrink: 0 !important;
      }
 
      /* הזרקת ה-SVG ספציפית לכל איקון */
      .cat-icon-control { 
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3C/svg%3E") !important; 
      }
      .cat-icon-sensor { 
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4.9 19.1C1 15.2 1 8.8 4.9 4.9'/%3E%3Cpath d='M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5'/%3E%3Ccircle cx='12' cy='12' r='2'/%3E%3Cpath d='M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5'/%3E%3Cpath d='M19.1 4.9C23 8.8 23 15.1 19.1 19'/%3E%3C/svg%3E") !important; 
      }
      .cat-icon-output { 
        background-image: url("${OutputIcon}") !important; 
      }
      .cat-icon-math { 
        background-image: url("${MathIcon}") !important; 
      }
      .cat-icon-logic { 
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='6' x2='6' y1='3' y2='15'/%3E%3Ccircle cx='18' cy='6' r='3'/%3E%3Ccircle cx='6' cy='18' r='3'/%3E%3Cpath d='M18 9a9 9 0 0 1-9 9'/%3E%3C/svg%3E") !important; 
      }
      .cat-icon-variables { 
        background-image: url("${VarIcon}") !important; 
        background-size: 70% !important;
      }

      /* סגנון כללי לשורות */
      .cat-bg-control { background-color: rgba(255, 171, 25, 0.6) !important; }
      .cat-bg-sensor { background-color: rgba(92, 177, 214, 0.6) !important; }
      .cat-bg-output { background-color: rgba(153, 102, 255, 0.6) !important; }
      .cat-bg-math { background-color: rgba(89, 192, 89, 0.6) !important; }
      .cat-bg-logic { background-color: rgba(255, 171, 25, 0.6) !important; }
      .cat-bg-variables { background-color: rgba(139, 92, 246, 0.6) !important; }

      /* אפקט בחירה */
      .blocklyTreeSelected {
        border-color: #4F46E5 !important;
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3) !important;
      }
    `;
    document.head.appendChild(style);

    const resizeObserver = new ResizeObserver(() => {
      Blockly.svgResize(workspaceRef.current!);
    });
    
    if (blocklyDiv.current) {
      resizeObserver.observe(blocklyDiv.current);
    }
    
    return () => {
      resizeObserver.disconnect();
      document.head.removeChild(style);
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, [onCodeChange]);

  const promptInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`w-full h-full relative border-l border-gray-200 transition-all duration-300 ${isRunning ? 'border-4 border-yellow-400' : ''}`}>
      <div ref={blocklyDiv} className="absolute inset-0" />
      {keypad && keypad.visible && (
        <NumericKeypad
          initialValue={keypad.initialValue}
          onValueSelected={keypad.onCallback}
          onClose={() => setKeypad(null)}
          position={keypad.position}
          color={keypad.color}
        />
      )}
      {promptDialog && promptDialog.visible && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h3 className="text-lg font-bold mb-4">{promptDialog.message}</h3>
            <input
              type="text"
              ref={promptInputRef}
              defaultValue={promptDialog.defaultValue}
              className="w-full border p-2 mb-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    promptDialog.callback(e.currentTarget.value);
                    setPromptDialog(null);
                }
              }}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => { promptDialog.callback(null); setPromptDialog(null); }} className="px-4 py-2 border rounded">ביטול</button>
              <button 
                onClick={() => {
                  if (promptInputRef.current) {
                      promptDialog.callback(promptInputRef.current.value);
                      setPromptDialog(null);
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded">אישור</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
